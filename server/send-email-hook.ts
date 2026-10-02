import { createElement } from "react";
import { render } from "@react-email/render";
import { Hono, type Context } from "hono";
import { Webhook } from "standardwebhooks";

import SignInCodeEmail from "../emails/sign-in-code";

/**
 * Supabase's Send Email hook. Once it is enabled, Supabase Auth sends no email
 * of its own and POSTs every auth email here instead, signed with the
 * Standard Webhooks scheme: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
 */
export interface SendEmailHookEvent {
  user: {
    email: string;
    user_metadata?: { display_name?: string };
  };
  email_data: {
    token: string;
    email_action_type: string;
  };
}

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/*
 * `signInWithOtp` sends `signup` to an address Supabase has not seen before and
 * `magiclink` to one it has; `email` is the generic OTP type. All three carry
 * the same six-digit code. Nothing in the app sends the others (recovery,
 * invite, email change, security notifications), so they are refused rather
 * than answered with a code email that would not make sense for them.
 */
const signInActions = new Set(["signup", "magiclink", "email"]);

export function sendEmailHook({
  secret,
  logoUrl,
  send,
}: {
  /** The `v1,whsec_…` secret from the Auth Hooks page of the dashboard. */
  secret: string;
  /** Absolute URL of the congrem logo shown in the email's header. */
  logoUrl?: string;
  send: (email: OutgoingEmail) => Promise<void>;
}): Hono {
  const webhook = new Webhook(secret.replace(/^v1,whsec_/, ""));
  const app = new Hono();

  app.post("/send-email", async (c) => {
    let event: SendEmailHookEvent;
    try {
      event = webhook.verify(
        await c.req.text(),
        c.req.header(),
      ) as SendEmailHookEvent;
    } catch {
      return hookError(c, 401, "Invalid signature.");
    }

    const { user, email_data } = event;
    if (!signInActions.has(email_data.email_action_type)) {
      console.warn(
        `[send-email-hook] unsupported email_action_type "${email_data.email_action_type}"`,
      );
      return hookError(
        c,
        400,
        `Unsupported email_action_type "${email_data.email_action_type}".`,
      );
    }

    try {
      const element = createElement(SignInCodeEmail, {
        code: email_data.token,
        name: user.user_metadata?.display_name,
        logoUrl,
      });
      await send({
        to: user.email,
        subject: `${email_data.token} is your congrem sign-in code`,
        html: await render(element),
        text: await render(element, { plainText: true }),
      });
    } catch (err) {
      console.error("[send-email-hook] failed to send sign-in code:", err);
      return hookError(c, 502, "Failed to send email.");
    }

    // Supabase reads an empty 200 as "sent".
    return c.json({});
  });

  return app;
}

/** The error shape Supabase Auth expects back from an HTTP hook. */
function hookError(c: Context, status: 400 | 401 | 502, message: string) {
  return c.json({ error: { http_code: status, message } }, status);
}
