import { describe, expect, it, vi } from "vitest";
import { Webhook } from "standardwebhooks";

import { congremBrand } from "../models/email";
import {
  type OutgoingEmail,
  sendEmailHook,
  userDataFrom,
  verifyUrl,
} from "./send-email-hook";

const secret = `v1,whsec_${Buffer.from("a".repeat(32)).toString("base64")}`;

function signedRequest(payload: unknown, signWith = secret) {
  const body = JSON.stringify(payload);
  const webhook = new Webhook(signWith.replace(/^v1,whsec_/, ""));
  const id = "msg_test";
  const timestamp = new Date();

  return new Request("http://localhost/send-email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "webhook-id": id,
      "webhook-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
      "webhook-signature": webhook.sign(id, timestamp, body),
    },
    body,
  });
}

const supabaseUrl = "https://project-ref.supabase.co";

function event(
  emailActionType: string,
  userMetadata: Record<string, unknown> = { display_name: "Alex" },
) {
  return {
    user: {
      email: "alex@example.com",
      user_metadata: userMetadata,
    },
    email_data: {
      token: "305805",
      token_hash: "pkce_8f1c2e9a4b",
      redirect_to: "https://congrem.com/reset-password",
      email_action_type: emailActionType,
    },
  };
}

describe("sendEmailHook", () => {
  it.each(["signup", "magiclink", "email"])(
    "sends the code for a %s email",
    async (type) => {
      const send = vi.fn<(email: OutgoingEmail) => Promise<void>>();
      const app = sendEmailHook({ secret, send });

      const res = await app.request(signedRequest(event(type)));

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({});
      expect(send).toHaveBeenCalledOnce();
      const email = send.mock.calls[0][0];
      expect(email.to).toBe("alex@example.com");
      expect(email.subject).toContain("305805");
      expect(email.html).toContain("305805");
      expect(email.text).toContain("305805");
      expect(email.text).toContain("Alex");
      expect(email.html).toContain(`src="${congremBrand.logoUrl}"`);
    },
  );

  it("brands the email with the tenant in the user's metadata", async () => {
    const send = vi.fn<(email: OutgoingEmail) => Promise<void>>();
    const app = sendEmailHook({ secret, send });
    const tenant = {
      name: "Kijult Weekend",
      logoUrl: "https://cdn.example.com/kijult.png",
      contact: "hello@kijult.com",
      socialNetworks: { instagram: "https://instagram.com/kijult" },
    };

    await app.request(
      signedRequest(event("magiclink", { display_name: "Alex", tenant })),
    );

    const email = send.mock.calls[0][0];
    expect(email.subject).toBe("305805 is your Kijult Weekend sign-in code");
    expect(email.html).toContain('src="https://cdn.example.com/kijult.png"');
    expect(email.html).not.toContain(`src="${congremBrand.logoUrl}"`);
    expect(email.text).toContain("hello@kijult.com");
    expect(email.html).toContain("social-instagram.png");
  });

  it("rejects a request signed with another secret", async () => {
    const send = vi.fn();
    const app = sendEmailHook({ secret, send });
    const other = `v1,whsec_${Buffer.from("b".repeat(32)).toString("base64")}`;

    const res = await app.request(signedRequest(event("magiclink"), other));

    expect(res.status).toBe(401);
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the password reset link for a recovery email", async () => {
    const send = vi.fn<(email: OutgoingEmail) => Promise<void>>();
    const app = sendEmailHook({ secret, supabaseUrl, send });

    const res = await app.request(signedRequest(event("recovery")));

    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    const email = send.mock.calls[0][0];
    const link =
      "https://project-ref.supabase.co/auth/v1/verify?token=pkce_8f1c2e9a4b&type=recovery&redirect_to=https%3A%2F%2Fcongrem.com%2Freset-password";
    expect(email.to).toBe("alex@example.com");
    expect(email.subject).toBe("Reset your congrem password");
    expect(email.html).toContain(`href="${link.replace(/&/g, "&amp;")}"`);
    expect(email.text).toContain(link);
    expect(email.text).toContain("Alex");
    // a link, not the code
    expect(email.text).not.toContain("305805");
  });

  it("refuses a recovery email when SUPABASE_URL is not set", async () => {
    const send = vi.fn();
    const app = sendEmailHook({ secret, send });

    const res = await app.request(signedRequest(event("recovery")));

    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: { http_code: 500 } });
    expect(send).not.toHaveBeenCalled();
  });

  it("refuses an action the app never sends", async () => {
    const send = vi.fn();
    const app = sendEmailHook({ secret, supabaseUrl, send });

    const res = await app.request(signedRequest(event("invite")));

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: { http_code: 400 } });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a failed send so Supabase surfaces it", async () => {
    const send = vi.fn().mockRejectedValue(new Error("Resend is down"));
    const app = sendEmailHook({ secret, send });

    const res = await app.request(signedRequest(event("magiclink")));

    expect(res.status).toBe(502);
  });
});

describe("verifyUrl", () => {
  it("leaves out redirect_to when Supabase sends none", () => {
    expect(
      verifyUrl(supabaseUrl, {
        token: "305805",
        token_hash: "pkce_1",
        email_action_type: "recovery",
      }),
    ).toBe("https://project-ref.supabase.co/auth/v1/verify?token=pkce_1&type=recovery");
  });
});

describe("userDataFrom", () => {
  it("drops what is not a short string, an https URL or an address", () => {
    const { tenant } = userDataFrom({
      tenant: {
        name: "Kijult",
        logoUrl: "http://cdn.example.com/kijult.png",
        url: "javascript:alert(1)",
        contact: "not an address",
        socialNetworks: { facebook: "https://facebook.com/kijult", x: 42 },
      },
    });

    expect(tenant).toEqual({
      name: "Kijult",
      logoUrl: undefined,
      url: undefined,
      contact: undefined,
      socialNetworks: {
        facebook: "https://facebook.com/kijult",
        instagram: undefined,
        x: undefined,
      },
    });
  });

  it("ignores a tenant without a name, and metadata that is not an object", () => {
    expect(userDataFrom({ tenant: { logoUrl: "https://x.com/l.png" } }).tenant).toBeUndefined();
    expect(userDataFrom("oops")).toEqual({ name: undefined, tenant: undefined });
  });
});
