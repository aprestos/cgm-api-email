import { Column, Row } from "react-email";

import { EmailLayout } from "../components/email-layout";
import {
  Box,
  BoxTitle,
  BrandFigure,
  DetailsList,
  EmailButton,
  Greeting,
  Paragraph,
  Strong,
} from "../components/email-ui";
import { shortId } from "../components/order.helper";
import { congremBrand, type EmailModel } from "../models/email";

export interface OrderRefundedContent {
  refund: {
    orderId?: string;
    /** The order number people see, like "5B6C1D02". */
    displayId?: string;
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
  // until every sender has `displayId`, a short form of the id
  const orderNumber = refund.displayId ?? (refund.orderId ? shortId(refund.orderId) : "");

  return (
    <EmailLayout
      preview={`Your refund of ${refund.refundAmount} is on its way`}
      title="Your refund is on its way"
      brand={brand}
      footerText={`Questions about your refund? Write to us at ${brand.contact ?? congremBrand.contact}.`}
    >
      <Greeting name={recipient.name} />
      <Paragraph>
        We&apos;ve refunded <Strong>{refund.refundAmount}</Strong> for order{" "}
        <Strong>{orderNumber}</Strong>. Depending on your bank or card issuer,
        it can take 5–10 business days to show up in your account.
      </Paragraph>

      <Box className="pt-8">
        <BoxTitle detail={refund.refundDate}>Refund details</BoxTitle>
        <DetailsList
          details={[
            {
              label: "Amount",
              value: <BrandFigure brand={brand}><b>{refund.refundAmount}</b></BrandFigure>,
            },
            { label: "Order", value: orderNumber },
            ...(refund.reason ? [{ label: "Reason", value: refund.reason }] : []),
          ]}
        />
      </Box>

      {refund.supportUrl
        ? (
          <Row>
            <Column className="pt-8">
                <Paragraph className="mb-5">
                  Something not right? Our support team is happy to help.
                </Paragraph>
                <EmailButton brand={brand} href={refund.supportUrl}>Contact support</EmailButton>
            </Column>
          </Row>
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
    // as the server reads it from the image when it renders
    logoSize: { width: 1080, height: 540 },
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
      // as the Stripe webhook sends it: the full id, no date
      orderId: "ord_0196a3c2-7b1e-7c40-9d2f-3a8e5b6c1d02",
      displayId: "5B6C1D02",
      refundAmount: "€78.00",
      reason: "Refund requested by customer",
      supportUrl: "https://congrem.com/support",
    },
  },
} satisfies EmailModel<OrderRefundedContent>;

export default OrderRefundedEmail;
