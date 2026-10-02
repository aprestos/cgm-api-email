import type { ComponentType } from "react";

import OrderConfirmationEmail from "../emails/order-confirmation";
import OrderRefundedEmail from "../emails/order-refunded";
import TicketDeliveryEmail from "../emails/ticket-delivery";

/** A registered email template: the component plus a default subject builder. */
interface TemplateEntry {
  Component: ComponentType<any>;
  subject: (data: any) => string;
}

/**
 * Registry mapping the `type` (sent via the `X-Email-Type` header) to a
 * template. Each component is the default export of a file in `emails/`.
 */
export const templates = {
  "ticket-delivery": {
    Component: TicketDeliveryEmail,
    subject: (d) => `Your tickets for ${d?.edition?.name ?? "your event"}`,
  },
  "order-confirmation": {
    Component: OrderConfirmationEmail,
    subject: (d) =>
      `Order confirmation${d?.edition?.name ? ` — ${d.edition.name}` : ""}`,
  },
  "order-refunded": {
    Component: OrderRefundedEmail,
    subject: (d) =>
      `Your refund of ${d?.refund?.refundAmount ?? "your amount"} is on its way`,
  },
} satisfies Record<string, TemplateEntry>;

export type EmailType = keyof typeof templates;

export const emailTypes = Object.keys(templates) as EmailType[];

export function isEmailType(value: string | undefined): value is EmailType {
  return value !== undefined && value in templates;
}
