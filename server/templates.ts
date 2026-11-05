import type { ComponentType } from "react";

import PasswordResetEmail, {
  type PasswordResetContent,
} from "../emails/auth/password-reset";
import SignInCodeEmail, {
  type SignInCodeContent,
} from "../emails/auth/sign-in-code";
import OrderConfirmationEmail, {
  type OrderConfirmationContent,
} from "../emails/order-confirmation";
import OrderRefundedEmail, {
  type OrderRefundedContent,
} from "../emails/order-refunded";
import TicketDeliveryEmail, {
  type TicketDeliveryContent,
} from "../emails/ticket-delivery";
import {
  brandFromTenant,
  type EmailModel,
  type TenantData,
} from "../models/email";
import { renderEmail } from "./render";

/*
 * The `data` cgm-api-supabase sends to `POST /emails`. It predates the model,
 * so each template maps it: `tenant` becomes the brand, `customer` (and the
 * `to` address) the recipient, and the rest the content.
 *
 * The auth emails come this way too: cgm-api-supabase answers Supabase Auth's
 * Send Email hook by sending them here, with the tenant it loaded by id.
 */
export interface EmailData {
  tenant?: TenantData;
  customer?: { name?: string; email?: string };
  /** ticket-delivery only, older name of `customer.name`. */
  customerName?: string;
  edition?: TicketDeliveryContent["edition"];
  order?: OrderConfirmationContent["order"];
  refund?: OrderRefundedContent["refund"];
  tickets?: TicketDeliveryContent["tickets"];
  /** sign-in-code */
  code?: string;
  /** password-reset */
  resetUrl?: string;
}

/** A registered email template: the component, how to build its model, and a default subject. */
interface TemplateEntry<Content> {
  Component: ComponentType<EmailModel<Content>>;
  toModel: (data: EmailData, to: string) => EmailModel<Content>;
  subject: (model: EmailModel<Content>) => string;
}

// infers `Content` per entry, so each `toModel` and `subject` is checked against its template
const template = <Content>(entry: TemplateEntry<Content>) => entry;

const shared = (data: EmailData, to: string) => ({
  brand: brandFromTenant(data.tenant),
  recipient: {
    name: data.customer?.name ?? data.customerName,
    email: data.customer?.email ?? to,
  },
});

/**
 * Registry mapping the `type` (sent via the `X-Email-Type` header) to a
 * template. Each component is the default export of a file in `emails/`.
 */
export const templates = {
  "ticket-delivery": template<TicketDeliveryContent>({
    Component: TicketDeliveryEmail,
    toModel: (data, to) => ({
      ...shared(data, to),
      content: { edition: data.edition, tickets: data.tickets ?? [] },
    }),
    subject: ({ content }) =>
      `Your tickets for ${content.edition?.name ?? "your event"}`,
  }),
  "order-confirmation": template<OrderConfirmationContent>({
    Component: OrderConfirmationEmail,
    toModel: (data, to) => ({
      ...shared(data, to),
      content: { edition: data.edition, order: data.order ?? {} },
    }),
    subject: ({ content }) =>
      `Order confirmation${content.edition?.name ? ` — ${content.edition.name}` : ""}`,
  }),
  "order-refunded": template<OrderRefundedContent>({
    Component: OrderRefundedEmail,
    toModel: (data, to) => ({
      ...shared(data, to),
      content: { refund: data.refund ?? {} },
    }),
    subject: ({ content }) =>
      `Your refund of ${content.refund.refundAmount ?? "your amount"} is on its way`,
  }),
  "sign-in-code": template<SignInCodeContent>({
    Component: SignInCodeEmail,
    toModel: (data, to) => {
      if (!data.code) throw new Error("A sign-in-code email needs `code`.");
      return { ...shared(data, to), content: { code: data.code } };
    },
    subject: ({ brand, content }) => `${content.code} is your ${brand.name} sign-in code`,
  }),
  "password-reset": template<PasswordResetContent>({
    Component: PasswordResetEmail,
    toModel: (data, to) => {
      if (!data.resetUrl) throw new Error("A password-reset email needs `resetUrl`.");
      return { ...shared(data, to), content: { resetUrl: data.resetUrl } };
    },
    subject: ({ brand }) => `Reset your ${brand.name} password`,
  }),
};

export type EmailType = keyof typeof templates;

export const emailTypes = Object.keys(templates) as EmailType[];

export function isEmailType(value: string | undefined): value is EmailType {
  return value !== undefined && value in templates;
}

/** Maps `data` to the template's model and renders it, with the default subject. */
export async function renderTemplate(type: EmailType, data: EmailData, to: string) {
  // each entry is checked on its own above; here only the shared shape matters
  const { Component, toModel, subject } = templates[type] as unknown as TemplateEntry<unknown>;
  const model = toModel(data, to);
  return { subject: subject(model), ...(await renderEmail(Component, model)) };
}
