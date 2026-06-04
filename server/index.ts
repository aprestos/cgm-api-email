import { createElement } from "react";
import { serve } from "@hono/node-server";
import { render } from "@react-email/render";
import { Hono } from "hono";
import { Resend } from "resend";

import { emailTypes, isEmailType, templates } from "./templates";

const PORT = Number(process.env.PORT ?? 3001);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;

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
  data?: Record<string, unknown>;
}

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true, types: emailTypes }));

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

serve({ fetch: app.fetch, port: PORT }, ({ port }) => {
  console.log(`Email API listening on http://localhost:${port}`);
});
