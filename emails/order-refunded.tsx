import { Section } from "react-email";

import { EmailLayout } from "../components/email-layout";
import {
  DetailsList,
  EmailButton,
  Panel,
  Paragraph,
  SectionTitle,
  Strong,
} from "../components/email-ui";
import { shortId } from "../components/order.helper";
import { congremBrand, type EmailModel } from "../models/email";

export interface OrderRefundedContent {
  refund: {
    orderId?: string;
    refundAmount?: string;
    refundDate?: string;
    refundMethod?: string;
    confirmationCode?: string;
    reason?: string;
    supportUrl?: string;
  };
}

export const OrderRefundedEmail = ({
  brand,
  recipient,
  content: { refund },
}: EmailModel<OrderRefundedContent>) => {
  const orderNumber = refund.orderId ? shortId(refund.orderId) : "";

  return (
    <EmailLayout
      preview={`Your refund of ${refund.refundAmount} is on its way`}
      icon="refund"
      eyebrow="Order refunded"
      title="Your refund is on its way"
      brand={brand}
      footerText={`If you have any questions about your refund, contact us at ${brand.contact ?? congremBrand.contact}.`}
    >
      <Paragraph className="mb-4">
        Hey{recipient.name ? ` ${recipient.name}` : ""},
      </Paragraph>
      <Paragraph>
        We&apos;ve issued a refund of <Strong>{refund.refundAmount}</Strong> for
        order <Strong>{orderNumber}</Strong>. Please allow 5–10 business days
        for the amount to appear depending on your bank or card issuer.
      </Paragraph>

      <SectionTitle className="mt-8 mb-3">Refund details</SectionTitle>
      <Panel>
        <DetailsList
          details={[
            { label: "Refund amount", value: refund.refundAmount },
            { label: "Order number", value: orderNumber },
            ...(refund.reason ? [{ label: "Reason", value: refund.reason }] : []),
          ]}
        />
      </Panel>

      {refund.supportUrl
        ? (
          <Section className="mt-8">
            <Paragraph className="mb-4">
              Questions about this refund? Our support team is here to help.
            </Paragraph>
            <EmailButton href={refund.supportUrl}>Contact support</EmailButton>
          </Section>
        )
        : null}
    </EmailLayout>
  );
};

OrderRefundedEmail.PreviewProps = {
  brand: {
    name: "Kijult Weekend",
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
    url: "https://congrem.com",
    contact: "info@congrem.com",
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
    },
  },
  recipient: { name: "Alex", email: "alex@example.com" },
  content: {
    refund: {
      orderId: "682304ab-0000-4000-8000-000000000000",
      refundAmount: "$196.00",
      refundDate: "Jun 13, 2026",
      reason: "Order cancelled by customer",
    },
  },
} satisfies EmailModel<OrderRefundedContent>;

export default OrderRefundedEmail;
