import { describe, expect, it, vi } from "vitest";
import { Webhook } from "standardwebhooks";

import { type OutgoingEmail, sendEmailHook } from "./send-email-hook";

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

function event(emailActionType: string) {
  return {
    user: {
      email: "alex@example.com",
      user_metadata: { display_name: "Alex" },
    },
    email_data: { token: "305805", email_action_type: emailActionType },
  };
}

describe("sendEmailHook", () => {
  it.each(["signup", "magiclink", "email"])(
    "sends the code for a %s email",
    async (type) => {
      const send = vi.fn<(email: OutgoingEmail) => Promise<void>>();
      const logoUrl = "https://email.example.com/static/congrem-logo-green@2x.png";
      const app = sendEmailHook({ secret, logoUrl, send });

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
      expect(email.html).toContain(`src="${logoUrl}"`);
    },
  );

  it("rejects a request signed with another secret", async () => {
    const send = vi.fn();
    const app = sendEmailHook({ secret, send });
    const other = `v1,whsec_${Buffer.from("b".repeat(32)).toString("base64")}`;

    const res = await app.request(signedRequest(event("magiclink"), other));

    expect(res.status).toBe(401);
    expect(send).not.toHaveBeenCalled();
  });

  it("refuses an action the app never sends", async () => {
    const send = vi.fn();
    const app = sendEmailHook({ secret, send });

    const res = await app.request(signedRequest(event("recovery")));

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
