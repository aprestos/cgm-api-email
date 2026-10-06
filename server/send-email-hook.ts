import { Hono, type Context } from "hono";
import { Webhook } from "standardwebhooks";

import PasswordResetEmail from "../emails/auth/password-reset";
import SignInCodeEmail from "../emails/auth/sign-in-code";
import {
  brandFromTenant,
  type EmailRecipient,
  type SocialNetworks,
  type TenantData,
} from "../models/email";
import { renderEmail } from "./render";
import { templates } from "./templates";

/**
 * Supabase's Send Email hook. Once it is enabled, Supabase Auth sends no email
 * of its own and POSTs every auth email here instead, signed with the
 * Standard Webhooks scheme: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
 *
 * Transitional: the hook now lives in cgm-api-supabase (`POST /emails/hook`),
 * which loads the tenant by the `tenant_id` in the user's metadata and sends
 * the email here through `POST /emails` as `sign-in-code` or
 * `password-reset`. Remove this one once Supabase Auth points there.
 */
export interface SendEmailHookEvent {
  user: {
    email: string;
    /** `{{ .Data }}` in Supabase's own templates; see `AuthUserData`. */
    user_metadata?: Record<string, unknown>;
  };
  email_data: {
    /** The six-digit code. */
    token: string;
    /** What the verify link carries instead of the code. */
    token_hash: string;
    /** Where Supabase sends the user once the link is verified. */
    redirect_to?: string;
    email_action_type: string;
  };
}

/**
 * What the app passes as `options.data` to `signInWithOtp`, which Supabase
 * stores as the user's metadata and sends back in every hook call for them.
 *
 * Supabase only stores it when it creates the account: for a user who
 * already exists, `options.data` is ignored and the hook sees what was stored
 * then. `resetPasswordForEmail` takes no data at all.
 */
export interface AuthUserData {
  display_name?: string;
  /** Brands the auth emails; the same shape as `tenant` in `/emails`. */
  tenant?: TenantData;
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
 * the same six-digit code.
 *
 * `resetPasswordForEmail` sends `recovery`, answered with a link rather than
 * the code: the verify endpoint signs the user in and redirects them to the
 * `redirectTo` the app passed, where they set the new password.
 *
 * Nothing in the app sends the others (invite, email change, security
 * notifications), so they are refused rather than answered with an email that
 * would not make sense for them.
 */
const signInActions = new Set(["signup", "magiclink", "email"]);

/** Supabase's verify link, the one its own templates call `{{ .ConfirmationURL }}`. */
export function verifyUrl(
  supabaseUrl: string,
  { token_hash, email_action_type, redirect_to }: SendEmailHookEvent["email_data"],
): string {
  const url = new URL("/auth/v1/verify", supabaseUrl);
  url.searchParams.set("token", token_hash);
  url.searchParams.set("type", email_action_type);
  // without it Supabase falls back to the project's Site URL
  if (redirect_to) url.searchParams.set("redirect_to", redirect_to);
  return url.toString();
}

/*
 * User metadata is not trusted input: a user can rewrite their own with
 * `updateUser`, and whoever calls `signInWithOtp` first for an address picks
 * the metadata of the account it creates. So every field is checked, and
 * anything that is not a short string, an https URL or an email address is
 * dropped rather than rendered into an email sent from our domain.
 */
const text = (value: unknown, max: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;

const httpsUrl = (value: unknown) => {
  const candidate = text(value, 2048);
  if (!candidate) return undefined;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

const emailAddress = (value: unknown) => {
  const candidate = text(value, 254);
  return candidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : undefined;
};

const record = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

/** The checked `AuthUserData` out of the user's metadata. */
export function userDataFrom(metadata: unknown): { name?: string; tenant?: TenantData } {
  const data = record(metadata) ?? {};
  const tenant = record(data.tenant);
  const socials = record(tenant?.socialNetworks);
  const name = text(tenant?.name, 80);

  return {
    name: text(data.display_name, 80),
    // without a name there is nothing to brand the email with
    tenant: tenant && name
      ? {
        name,
        logoUrl: httpsUrl(tenant.logoUrl),
        url: httpsUrl(tenant.url),
        contact: emailAddress(tenant.contact),
        socialNetworks: socials
          ? ({
            facebook: httpsUrl(socials.facebook),
            instagram: httpsUrl(socials.instagram),
            x: httpsUrl(socials.x),
          } satisfies SocialNetworks)
          : undefined,
      }
      : undefined,
  };
}

export function sendEmailHook({
  secret,
  supabaseUrl,
  send,
}: {
  /** The `v1,whsec_…` secret from the Auth Hooks page of the dashboard. */
  secret: string;
  /** The project URL, `https://<ref>.supabase.co`; the password reset link points there. */
  supabaseUrl?: string;
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

    // map the payload to the model every template renders from
    const { user, email_data } = event;
    const action = email_data.email_action_type;
    const { name, tenant } = userDataFrom(user.user_metadata);
    const brand = brandFromTenant(tenant);
    const recipient: EmailRecipient = { name, email: user.email };

    let subject: string;
    let compose: () => Promise<{ html: string; text: string }>;
    if (signInActions.has(action)) {
      const model = { brand, recipient, content: { code: email_data.token } };
      subject = templates["sign-in-code"].subject(model);
      compose = () => renderEmail(SignInCodeEmail, model);
    } else if (action === "recovery") {
      if (!supabaseUrl) {
        console.error(
          "[send-email-hook] cannot send a password reset: SUPABASE_URL is not set",
        );
        return hookError(c, 500, "Password reset emails are not configured.");
      }
      const model = { brand, recipient, content: { resetUrl: verifyUrl(supabaseUrl, email_data) } };
      subject = templates["password-reset"].subject(model);
      compose = () => renderEmail(PasswordResetEmail, model);
    } else {
      console.warn(`[send-email-hook] unsupported email_action_type "${action}"`);
      return hookError(c, 400, `Unsupported email_action_type "${action}".`);
    }

    try {
      await send({ to: user.email, subject, ...(await compose()) });
    } catch (err) {
      console.error(`[send-email-hook] failed to send the ${action} email:`, err);
      return hookError(c, 502, "Failed to send email.");
    }

    // Supabase reads an empty 200 as "sent".
    return c.json({});
  });

  return app;
}

/** The error shape Supabase Auth expects back from an HTTP hook. */
function hookError(
  c: Context,
  status: 400 | 401 | 500 | 502,
  message: string,
) {
  return c.json({ error: { http_code: status, message } }, status);
}
