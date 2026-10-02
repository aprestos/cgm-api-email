import { createElement } from "react";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { render } from "@react-email/render";
import { Hono } from "hono";
import { Resend } from "resend";

import { sendEmailHook } from "./send-email-hook";
import { emailTypes, isEmailType, templates } from "./templates";

const PORT = Number(process.env.PORT ?? 3001);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const SEND_EMAIL_HOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRET;
const PUBLIC_URL = process.env.PUBLIC_URL?.replace(/\/+$/, "");

if (!RESEND_API_KEY) {
  console.warn(
    "[warn] RESEND_API_KEY is not set — sending will fail until it is configured.",
  );
}

const resend = new Resend(RESEND_API_KEY);

interface SendBody {
  to?: string | string[];
  from?: string;
  subject?: string;
  replyTo?: string;
  data?: unknown;
}

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true, types: emailTypes }));

// Images the emails link to. Mail clients fetch them when the email is opened,
// so they need an absolute URL, built from PUBLIC_URL.
app.use("/static/*", serveStatic({ root: "./" }));

if (!PUBLIC_URL) {
  console.warn(
    "[warn] PUBLIC_URL is not set — emails will show the brand name instead of the congrem logo.",
  );
}

app.post("/emails", async (c) => {
  // 1. Optional shared-secret auth.
  if (EMAIL_API_KEY) {
    const auth = c.req.header("authorization");
    if (auth !== `Bearer ${EMAIL_API_KEY}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }

  // 2. Resolve the template `type` from the header (or `?type=` fallback).
  const type = c.req.header("x-email-type") ?? c.req.query("type");
  if (!isEmailType(type)) {
    return c.json(
      {
        error: type
          ? `Unknown email type "${type}".`
          : "Missing email type. Provide the X-Email-Type header.",
        validTypes: emailTypes,
      },
      400,
    );
  }

  // 3. Parse and validate the body.
  let body: SendBody;
  try {
    body = await c.req.json<SendBody>();
  } catch {
    return c.json({ error: "Invalid JSON body." }, 400);
  }

  const { to, data = {}, subject, replyTo } = body;
  if (!to || (Array.isArray(to) && to.length === 0)) {
    return c.json({ error: "`to` is required." }, 400);
  }

  const from = body.from ?? RESEND_FROM;
  if (!from) {
    return c.json(
      { error: "No sender configured. Provide `from` or set RESEND_FROM." },
      400,
    );
  }

  const { Component, subject: defaultSubject } = templates[type];

  // 4. Render the template to HTML.
  let html: string;
  let text: string;
  try {
    const element = createElement(Component, data);
    html = await render(element);
    text = await render(element, { plainText: true });
  } catch (err) {
    console.error(`[render] failed for type "${type}":`, err);
    return c.json({ error: "Failed to render email template." }, 500);
  }

  // 5. Send via Resend.
  const { data: sent, error } = await resend.emails.send({
    from,
    to,
    subject: subject ?? defaultSubject(data),
    replyTo,
    html,
    text,
  });

  if (error) {
    console.error(`[resend] send failed for type "${type}":`, error);
    return c.json({ error: error.message ?? "Failed to send email." }, 502);
  }

  return c.json({ id: sent?.id });
});

// Supabase Auth's Send Email hook. It authenticates with its own signature, so
// it is registered only when that secret is configured.
if (SEND_EMAIL_HOOK_SECRET) {
  app.route(
    "/hooks",
    sendEmailHook({
      secret: SEND_EMAIL_HOOK_SECRET,
      logoUrl: PUBLIC_URL && `${PUBLIC_URL}/static/congrem-logo-green@2x.png`,
      send: async (email) => {
        if (!RESEND_FROM) throw new Error("RESEND_FROM is not set.");
        const { error } = await resend.emails.send({ from: RESEND_FROM, ...email });
        if (error) throw new Error(error.message);
      },
    }),
  );
} else {
  console.warn(
    "[warn] SEND_EMAIL_HOOK_SECRET is not set — POST /hooks/send-email is disabled.",
  );
}

serve({ fetch: app.fetch, port: PORT }, ({ port }) => {
  console.log(`Email API listening on http://localhost:${port}`);
});
