import { Column, Row, Section, Text } from "react-email";

import { CtaButton } from "../components/cta-button";
import { EmailLayout } from "../components/email-layout";
import { emailTheme, styles } from "../components/email-theme";
import { InfoRow } from "../components/info-row";

export interface OrderRefundedEmailProps {
  tenant?: {
    contact?: string;
    socialNetworks?: {
      facebook?: string;
      instagram?: string;
      x?: string;
    };
    logoUrl?: string;
    url?: string;
  };
  customer?: {
    name?: string;
  };
  refund?: {
    orderId?: string;
    refundAmount?: string;
    refundDate?: string;
    refundMethod?: string;
    confirmationCode?: string;
    reason?: string;
    supportUrl?: string;
  };
}

const centerParagraph = {
  margin: "0 0 24px",
  fontSize: "15px",
  lineHeight: "160%",
  color: "#4b5563",
  textAlign: "center" as const,
};

const detailLine = {
  padding: "4px 0",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: 0,
};

const valueStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#111827",
  fontWeight: 600,
  textAlign: "right" as const,
};

export const OrderRefundedEmail = ({
  tenant = {
    contact: "info@congrem.io",
    socialNetworks: { facebook: "", instagram: "", x: "" },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
  },
  customer = {
    name: "Alex",
  },
  refund = {
    orderId: "#682304",
    refundAmount: "$196.00",
    refundDate: "Jun 13, 2026",
    refundMethod: "Original payment method",
    confirmationCode: "REF-8XK2-2026",
    reason: "Order cancelled by customer",
    supportUrl: "",
  },
}: OrderRefundedEmailProps) => (
  <EmailLayout
    preview={`Your refund of ${refund.refundAmount} is on its way`}
    title="Order refunded"
    subtitle=""
    brandName="congrem.io"
    brandLogoUrl={tenant.logoUrl}
    logoPlaceholderText="CE"
    supportEmail={tenant.contact}
    heroIconUrl="https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/app/moneybag-move-back.png"
    socialNetworks={tenant.socialNetworks}
    url={tenant.url}
    footerText={`If you have any questions about your refund, contact us at ${tenant.contact ?? "info@congrem.io"}.`}
  >
    <Section style={styles.section}>
      <Text style={styles.paragraph}>Hey {customer?.name},</Text>
      <Text style={styles.paragraph}>
        We&apos;ve issued a refund of{" "}
        <strong style={{ color: emailTheme.colors.text }}>
          {refund.refundAmount}
        </strong>{" "}
        for order <strong style={{ color: emailTheme.colors.text }}>{refund.orderId}</strong>.
        Please allow 5–10 business days for the amount to appear depending on
        your bank or card issuer.
      </Text>
    </Section>

    <Section
      style={{
        ...styles.section,
        borderTop: `1px solid ${emailTheme.colors.border}`,
      }}
    >
      <Text style={{ ...styles.sectionTitle, textAlign: "center" }}>
        Refund details
      </Text>

      <Section>
        <Row>
          <Column>
            <Text style={detailLine}>Refund amount</Text>
          </Column>
          <Column align="right">
            <Text style={{ ...detailLine, ...valueStyle }}>
              {refund.refundAmount}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={detailLine}>Order number</Text>
          </Column>
          <Column align="right">
            <Text style={{ ...detailLine, ...valueStyle }}>
              {refund.orderId}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={detailLine}>Refund date</Text>
          </Column>
          <Column align="right">
            <Text style={{ ...detailLine, ...valueStyle }}>
              {refund.refundDate}
            </Text>
          </Column>
        </Row>
        {refund.reason
          ? (
            <Row>
              <Column>
                <Text style={detailLine}>Reason</Text>
              </Column>
              <Column align="right">
                <Text style={{ ...detailLine, ...valueStyle }}>
                  {refund.reason}
                </Text>
              </Column>
            </Row>
          )
          : null}
      </Section>
    </Section>

    {refund.supportUrl
      ? (
        <Section style={styles.section}>
          <InfoRow
            label="Need help?"
            value="If you have any questions about this refund, our support team is here."
          />
          <CtaButton href={refund.supportUrl} label="Contact support" />
        </Section>
      )
      : null}
  </EmailLayout>
);

OrderRefundedEmail.PreviewProps = {
  tenant: {
    contact: "info@congrem.io",
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
    },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
    url: "https://congrem.io",
  },
  customer: {
    name: "Alex",
  },
  refund: {
    orderId: "#682304",
    refundAmount: "$196.00",
    refundDate: "Jun 13, 2026",
    refundMethod: "",
    confirmationCode: "",
    reason: "Order cancelled by customer",
    supportUrl: "",
  },
} as OrderRefundedEmailProps;

export default OrderRefundedEmail;
