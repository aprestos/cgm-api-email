import { afterEach, describe, expect, it, vi } from "vitest";

import { congremBrand } from "../models/email";
import { emailTypes, renderTemplate, templates } from "./templates";

// the start of a PNG: the signature and an IHDR chunk with the size
const pngHeader = (width: number, height: number) => {
  const bytes = new Uint8Array(33);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]);
  bytes.set(new TextEncoder().encode("IHDR"), 12);
  const view = new DataView(bytes.buffer);
  view.setUint32(16, width);
  view.setUint32(20, height);
  return bytes;
};

describe("templates", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

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

  it("uses the tenant's colour", async () => {
    const email = await renderTemplate(
      "sign-in-code",
      { tenant: { name: "Kijult Weekend", theme: { brandColor: "#D7263D" } }, code: "305805" },
      "alex@example.com",
    );

    expect(email.html).toContain("background-color:#D7263D");
  });

  it("shows a ticket's name and days, or falls back to its validity", async () => {
    const ticket = (code: string, extra: object) => ({
      attendee_name: "Alex",
      attendee_email: "alex@example.com",
      code,
      ticket: {
        valid_from: "2026-06-13T10:00:00Z",
        valid_until: "2026-06-14T20:00:00Z",
        ...extra,
      },
    });
    const email = await renderTemplate(
      "ticket-delivery",
      {
        customer: { name: "Alex" },
        tickets: [
          ticket("TCK-1", { name: "Weekend pass", days: ["2026-06-14", "2026-06-13"] }),
          ticket("TCK-2", {}),
        ],
      },
      "alex@example.com",
    );

    expect(email.text).toContain("Weekend pass · 13\u00a0Jun, 14\u00a0Jun");
    expect(email.text).toContain("2 days · 13 – 14 Jun");
  });

  it("shows the edition's dates as an interval, or its start alone", async () => {
    const dates = async (edition: object) =>
      (await renderTemplate("ticket-delivery", { edition }, "alex@example.com")).text;

    expect(await dates({ startsAt: "2026-06-13T10:00:00", endsAt: "2026-06-14T20:00:00" }))
      .toContain("13 – 14 Jun 2026");
    expect(await dates({ startsAt: "2026-05-30T10:00:00", endsAt: "2026-06-01T20:00:00" }))
      .toContain("30 May – 1 Jun 2026");
    expect(await dates({ startsAt: "2026-12-31T10:00:00", endsAt: "2027-01-01T20:00:00" }))
      .toContain("31 Dec 2026 – 1 Jan 2027");
    expect(await dates({ startsAt: "2026-06-13T10:00:00", endsAt: "2026-06-13T20:00:00" }))
      .toContain("13 Jun 2026");
    expect(await dates({ startsAt: "2026-06-13T10:00:00" })).toContain("13 Jun 2026");
  });

  it("shows the displayId, not the id, for orders, refunds and tickets", async () => {
    const id = "ord_0196a3c2-7b1e-7c40-9d2f-3a8e5b6c1d02";
    const order = await renderTemplate(
      "order-confirmation",
      { order: { orderId: id, displayId: "A1B2C3" } },
      "alex@example.com",
    );
    const refund = await renderTemplate(
      "order-refunded",
      { refund: { orderId: id, displayId: "A1B2C3", refundAmount: "€78.00" } },
      "alex@example.com",
    );
    const tickets = await renderTemplate(
      "ticket-delivery",
      {
        tickets: [{
          attendee_name: "Alex",
          attendee_email: "alex@example.com",
          code: "secret-qr-payload",
          displayId: "TCK-001",
          ticket: { valid_from: "2026-06-13T10:00:00Z", valid_until: "2026-06-13T20:00:00Z" },
        }],
      },
      "alex@example.com",
    );

    expect(order.text).toContain("#A1B2C3");
    expect(order.text).not.toContain(id);
    expect(refund.text).toContain("A1B2C3");
    expect(refund.text).not.toContain("0196A3C2");
    expect(tickets.text).toContain("TCK-001");
    expect(tickets.text).not.toContain("secret-qr-payload");
  });

  it("renders with the default subject", async () => {
    const email = await renderTemplate(
      "order-refunded",
      { customer: { name: "Alex" }, refund: { refundAmount: "$196.00" } },
      "alex@example.com",
    );

    expect(email.subject).toBe("Your refund of $196.00 is on its way");
    expect(email.text).toContain("Hi Alex,");
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
    expect(signIn.text).toContain("Hi Alex,");
    expect(signIn.text).toContain("Use this code to sign in to Kijult Weekend.");

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

  it("gives the logo the width and height that fit it in 200×40", async () => {
    const fetch = vi.fn(async () => new Response(pngHeader(1080, 540)));
    vi.stubGlobal("fetch", fetch);
    const tenant = { name: "Kijult Weekend", logoUrl: "https://cdn.example.com/wide.png" };

    const email = await renderTemplate("sign-in-code", { tenant, code: "305805" }, "alex@example.com");
    await renderTemplate("sign-in-code", { tenant, code: "305805" }, "alex@example.com");

    expect(email.html).toMatch(/<img alt="Kijult Weekend" height="40"[^>]*width="80"/);
    expect(email.html).toContain("width:80px;height:40px");
    // read once per logo
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("keeps the logo's height alone when it can't read the image", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 404 })));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const tenant = { name: "Kijult Weekend", logoUrl: "https://cdn.example.com/missing.png" };

    const email = await renderTemplate("sign-in-code", { tenant, code: "305805" }, "alex@example.com");

    expect(email.html).toMatch(/<img alt="Kijult Weekend" height="40"/);
    expect(email.html).toContain("width:auto;height:40px");
  });

  it("puts padding and vertical margins on cells, and gives tables a CSS width", async () => {
    const ticket = {
      attendee_name: "Alex",
      attendee_email: "alex@example.com",
      code: "TCK-1",
      ticket: { valid_from: "2026-06-13T10:00:00Z", valid_until: "2026-06-13T20:00:00Z" },
    };
    const data = {
      edition: { name: "Summer Fest" },
      order: { items: [{ name: "Weekend pass", quantity: 1, price: "€30.00" }] },
      refund: { refundAmount: "€30.00" },
      tickets: [ticket],
      code: "305805",
      resetUrl: "https://example.com/reset",
    };

    for (const type of emailTypes) {
      const { html } = await renderTemplate(type, data, "alex@example.com");
      expect(html, type).not.toMatch(/<table[^>]*style="[^"]*(padding|margin-top|margin-bottom)/);
      // Full width in CSS too (`fullWidth`): an app that drops the attribute
      // shrinks and centres the table. The first is <Body>'s, which takes no
      // style; the tables inside it stretch it. The <Container> keeps its
      // max-width instead of a min-width.
      for (const [table] of [...html.matchAll(/<table[^>]*width="100%"[^>]*>/g)].slice(1)) {
        expect(table, type).toMatch(/style="[^"]*width:100%/);
        if (!table.includes("max-width")) expect(table, type).toMatch(/style="[^"]*min-width:100%/);
      }
    }
  });
});
