import { Column, Text } from "react-email";

import { EmailLayout } from "../components/email-layout";
import {
  Box,
  BoxRow,
  BoxTitle,
  BrandFigure,
  Greeting,
  Paragraph,
  Strong,
} from "../components/email-ui";
import type { EmailModel } from "../models/email";

export interface OrderItem {
  name: string;
  category?: string;
  quantity: number;
  price: string;
  imageUrl?: string;
}

export interface OrderConfirmationContent {
  edition?: {
    name?: string;
  };
  order: {
    orderId?: string;
    /** The order number people see, like "5B6C1D02". */
    displayId?: string;
    orderDate?: string;
    orderLink?: string;
    subtotal?: string;
    shipping?: string;
    tax?: string;
    totalAmount?: string;
    billingAddress?: string[];
    items?: OrderItem[];
  };
}

export const OrderConfirmationEmail = ({
  brand,
  recipient,
  content: { edition, order },
}: EmailModel<OrderConfirmationContent>) => {
  // until every sender has `displayId`, the id it sent, already shortened
  const orderNumber = order.displayId ?? order.orderId;

  return (
    <EmailLayout
      preview={`Order #${orderNumber} is confirmed. Your tickets are on their way.`}
      title="Thanks for your order"
      brand={brand}
    >
      <Greeting name={recipient.name} />
      <Paragraph>
        Your order <Strong>#{orderNumber}</Strong> is confirmed. Your tickets
        will arrive in a separate email within a few minutes.
      </Paragraph>

      <Box className="pt-8">
        <BoxTitle detail={[edition?.name, order.orderDate].filter(Boolean).join(" · ")}>
          Order summary
        </BoxTitle>
        {(order.items ?? []).map((item) => (
          <BoxRow key={`${item.name}-${item.price}`}>
            <Column className="py-4 align-top">
              <Text className="m-0 text-[16px] leading-[22px] text-[#222222] dark:text-white">
                {item.name} × {item.quantity}
              </Text>
              {item.category
                ? (
                  <Text className="m-0 text-[14px] leading-[20px] text-[#6a6a6a] dark:text-[#b0b0b0]">
                    {item.category}
                  </Text>
                )
                : null}
            </Column>
            <Column
              align="right"
              className="py-4 pl-4 text-right align-top text-[16px] leading-[22px] text-[#222222] dark:text-white"
            >
              {item.price}
            </Column>
          </BoxRow>
        ))}
        <BoxRow>
          <Column className="py-5 text-[16px] leading-[22px] font-bold text-[#222222] dark:text-white">
            Total
          </Column>
          <Column
            align="right"
            className="py-5 text-right text-[22px] leading-[28px] font-bold"
          >
            <BrandFigure brand={brand}>{order.totalAmount}</BrandFigure>
          </Column>
        </BoxRow>
      </Box>
    </EmailLayout>
  );
};

OrderConfirmationEmail.PreviewProps = {
  brand: {
    name: "Kijult Weekend",
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
    // as the server reads it from the image when it renders
    logoSize: { width: 1080, height: 540 },
    contact: "info@congrem.com",
    // synthetic, for the preview: no tenant has a colour yet
    theme: { brandColor: "#D7263D" },
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
      x: "https://x.com/example",
    },
  },
  recipient: { name: "Alexander", email: "alexander@the.great" },
  content: {
    edition: { name: "Kijult Weekend 2026" },
    order: {
      // as cgm-api-supabase sends them: a short id, an en-GB date and time
      orderId: "ord_0196a3c2-7b1e-7c40-9d2f-3a8e5b6c1d02",
      displayId: "5B6C1D02",
      orderDate: "2 May 2026 at 14:32",
      totalAmount: "€78.00",
      items: [
        { name: "Weekend pass", category: "Saturday and Sunday", quantity: 2, price: "€60.00" },
        { name: "Saturday pass", category: "Saturday only", quantity: 1, price: "€18.00" },
      ],
    },
  },
} satisfies EmailModel<OrderConfirmationContent>;

export default OrderConfirmationEmail;
