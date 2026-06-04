import { IconCurrencyDollar } from "@tabler/icons-react";
import { Section, Text } from "react-email";

import { EmailLayout } from "../components/email-layout";
import { emailTheme, styles } from "../components/email-theme";

export interface PaymentConfirmationEmailProps {
  tenant: {
    contact: string;
    socialNetworks: {
      facebook: string;
      instagram: string;
      x: string;
    };
    logoUrl: string;
  };
  edition: {
    name: string;
  };
  payment: {
    customerName?: string;
    receivedAmount?: string;
    paymentAmount?: string;
    paymentDate?: string;
    paymentMethod?: string;
    confirmationCode?: string;
  };
}

const centerParagraph = {
  margin: "0 0 24px",
  fontSize: "15px",
  lineHeight: "160%",
  color: "#4b5563",
  textAlign: "center" as const,
};

const labelCell = {
  padding: "4px 12px 4px 0",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4b5563",
};

const valueCell = {
  padding: "4px 0 4px 12px",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#111827",
  fontWeight: 600,
  textAlign: "right" as const,
};

const detailLine = {
  ...labelCell,
  margin: 0,
};

export const PaymentConfirmationEmail = ({
  tenant = {
    contact: "info@congrem.io",
    socialNetworks: { facebook: "", instagram: "", x: "" },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
  },
  edition = { name: "" },
  payment = {
    customerName: "Alexander",
    receivedAmount: "$55.47",
    paymentAmount: "$64.25",
    paymentDate: "Mar 4, 2022",
    paymentMethod: "Bank Account 9026",
    confirmationCode: "1YOLO-TBLR",
  },
}: PaymentConfirmationEmailProps) => (
  <EmailLayout
    preview={`Payment received - ${payment.receivedAmount}`}
    title="Payment received"
    subtitle=""
    brandName="congrem.io"
    brandLogoUrl={tenant.logoUrl}
    logoPlaceholderText="CE"
    heroIcon={IconCurrencyDollar}
    footerText={`If you have any questions, feel free to message us at ${tenant.contact}.`}
  >
    <Section style={styles.section}>
      <Text style={centerParagraph}>
        We&apos;ve received your <strong>{payment.receivedAmount}</strong>{" "}
        payment, {payment.customerName}.
      </Text>
    </Section>

    <Section
      style={{
        ...styles.section,
        borderTop: `1px solid ${emailTheme.colors.border}`,
      }}
    >
      <Text style={{ ...styles.sectionTitle, textAlign: "center" }}>
        Payment Details
      </Text>

      <Section>
        <Text style={detailLine}>
          <span>Payment amount</span>
          <span style={{ float: "right", ...valueCell }}>
            {payment.paymentAmount}
          </span>
        </Text>
        <Text style={detailLine}>
          <span>Payment date</span>
          <span style={{ float: "right", ...valueCell }}>
            {payment.paymentDate}
          </span>
        </Text>
        <Text style={detailLine}>
          <span>Payment method</span>
          <span style={{ float: "right", ...valueCell }}>
            {payment.paymentMethod}
          </span>
        </Text>
        <Text style={detailLine}>
          <span>Confirmation</span>
          <span style={{ float: "right", ...valueCell }}>
            {payment.confirmationCode}
          </span>
        </Text>
      </Section>
    </Section>
  </EmailLayout>
);

PaymentConfirmationEmail.PreviewProps = {
  tenant: {
    contact: "info@congrem.io",
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
      x: "https://x.com/example",
    },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
  },
  edition: {
    name: "Example Edition",
  },
  payment: {
    customerName: "Alexander",
    receivedAmount: "$55.47",
    paymentAmount: "$64.25",
    paymentDate: "Mar 4, 2022",
    paymentMethod: "Bank Account 9026",
    confirmationCode: "1YOLO-TBLR",
  },
} as PaymentConfirmationEmailProps;

export default PaymentConfirmationEmail;
