import { Column, Text } from "react-email";

import { EmailLayout } from "../components/email-layout";
import {
  DetailsList,
  ListRow,
  Panel,
  Paragraph,
  SectionTitle,
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
  content: { order },
}: EmailModel<OrderConfirmationContent>) => (
  <EmailLayout
    preview={`Your order ${order.orderId} has been placed`}
    icon="cart"
    eyebrow="Order confirmed"
    title="Thanks for your order"
    brand={brand}
  >
    <Paragraph className="mb-4">
      Hey{recipient.name ? ` ${recipient.name}` : ""},
    </Paragraph>
    <Paragraph>
      Your order <Strong>#{order.orderId}</Strong> has successfully been placed
      and you can find all the details below. The tickets will be sent in a
      separate email in a few minutes.
    </Paragraph>

    <SectionTitle className="mt-8 mb-3">Order summary</SectionTitle>
    <Panel>
      {(order.items ?? []).map((item, index) => (
        <ListRow key={`${item.name}-${item.price}`} first={index === 0}>
          <Column className="py-4 align-top">
            <Text className="my-0 text-[15px] leading-[22px] font-medium text-neutral-900 dark:text-white">
              {item.name}
            </Text>
            {item.category
              ? (
                <Text className="my-0 text-[13px] leading-[20px] text-neutral-500 dark:text-neutral-400">
                  {item.category}
                </Text>
              )
              : null}
          </Column>
          <Column
            align="center"
            className="w-[48px] py-4 text-center align-top text-[14px] leading-[22px] text-neutral-500 dark:text-neutral-400"
          >
            ×{item.quantity}
          </Column>
          <Column
            align="right"
            className="w-[88px] py-4 text-right align-top text-[15px] leading-[22px] font-medium text-neutral-900 dark:text-white"
          >
            {item.price}
          </Column>
        </ListRow>
      ))}
      <ListRow first={!order.items?.length}>
        <Column className="py-4 text-[15px] leading-[24px] font-semibold text-neutral-900 dark:text-white">
          Total
        </Column>
        <Column
          align="right"
          className="py-4 text-right text-[18px] leading-[24px] font-semibold text-neutral-900 dark:text-white"
        >
          {order.totalAmount}
        </Column>
      </ListRow>
    </Panel>

    <SectionTitle className="mt-8 mb-3">Details</SectionTitle>
    <Panel>
      <DetailsList
        details={[
          { label: "Order number", value: order.orderId },
          { label: "Order date", value: order.orderDate },
        ]}
      />
    </Panel>
  </EmailLayout>
);

OrderConfirmationEmail.PreviewProps = {
  brand: {
    name: "Kijult Weekend",
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
    contact: "info@congrem.com",
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
      x: "https://x.com/example",
    },
  },
  recipient: { name: "Alexander", email: "alexander@the.great" },
  content: {
    edition: { name: "Example Edition" },
    order: {
      orderId: "682304",
      orderDate: "19 December 2022",
      totalAmount: "$196",
      items: [
        { name: "Magical notebook", category: "Superheroes things", quantity: 1, price: "$399" },
        { name: "Dragonfly eyes", category: "Unnecessary things", quantity: 1, price: "$145" },
        { name: "Fireman's pipe", category: "Kitchen items", quantity: 1, price: "$400" },
      ],
    },
  },
} satisfies EmailModel<OrderConfirmationContent>;

export default OrderConfirmationEmail;
