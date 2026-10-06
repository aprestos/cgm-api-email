import { describe, expect, it } from "vitest";

import { congremBrand } from "../models/email";
import { renderTemplate, templates } from "./templates";

describe("templates", () => {
  it("maps the body cgm-api-supabase sends to the model", () => {
    const model = templates["order-confirmation"].toModel(
      {
        tenant: {
          name: "Kijult Weekend",
          logoUrl: "https://cdn.example.com/kijult.png",
          contact: "hello@kijult.com",
        },
        customer: { name: "Alex" },
        edition: { name: "Summer Fest" },
        order: { orderId: "682304", totalAmount: "$196" },
      },
      "alex@example.com",
    );

    expect(model).toEqual({
      brand: {
        name: "Kijult Weekend",
        logoUrl: "https://cdn.example.com/kijult.png",
        contact: "hello@kijult.com",
        url: undefined,
        socialNetworks: undefined,
      },
      recipient: { name: "Alex", email: "alex@example.com" },
      content: {
        edition: { name: "Summer Fest" },
        order: { orderId: "682304", totalAmount: "$196" },
      },
    });
  });

  it("falls back to congrem's brand and the older customerName", () => {
    const model = templates["ticket-delivery"].toModel(
      { customerName: "Sam" },
      "sam@example.com",
    );

    expect(model.brand).toBe(congremBrand);
    expect(model.recipient.name).toBe("Sam");
    expect(model.content.tickets).toEqual([]);
  });

  it("renders with the default subject", async () => {
    const email = await renderTemplate(
      "order-refunded",
      { customer: { name: "Alex" }, refund: { refundAmount: "$196.00" } },
      "alex@example.com",
    );

    expect(email.subject).toBe("Your refund of $196.00 is on its way");
    expect(email.text).toContain("Hey Alex,");
    expect(email.text).toContain("$196.00");
  });

  it("maps the auth emails cgm-api-supabase queues for the Send Email hook", async () => {
    const tenant = { name: "Kijult Weekend", contact: "hello@kijult.com" };

    const signIn = await renderTemplate(
      "sign-in-code",
      { tenant, customer: { name: "Alex" }, code: "305805" },
      "alex@example.com",
    );
    expect(signIn.subject).toBe("305805 is your Kijult Weekend sign-in code");
    expect(signIn.text).toContain("Hi Alex, enter this code to sign in to Kijult Weekend.");

    const reset = await renderTemplate(
      "password-reset",
      { tenant, resetUrl: "https://project-ref.supabase.co/auth/v1/verify?token=t&type=recovery" },
      "alex@example.com",
    );
    expect(reset.subject).toBe("Reset your Kijult Weekend password");
    expect(reset.text).toContain("https://project-ref.supabase.co/auth/v1/verify?token=t&type=recovery");
  });

  it("refuses an auth email without its code or link", async () => {
    await expect(renderTemplate("sign-in-code", {}, "alex@example.com")).rejects.toThrow("code");
    await expect(renderTemplate("password-reset", {}, "alex@example.com")).rejects.toThrow("resetUrl");
  });
});
