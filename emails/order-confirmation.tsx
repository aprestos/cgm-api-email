import { Column, Row, Section, Text } from "react-email";
import { IconShoppingCart } from "@tabler/icons-react";

import { EmailLayout } from "../components/email-layout";
import { emailTheme, styles } from "../components/email-theme";

export interface OrderItem {
  name: string;
  category?: string;
  quantity: number;
  price: string;
  imageUrl: string;
}

export interface OrderConfirmationEmailProps {
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
  edition?: {
    name?: string;
  };
  customer?: {
    name?: string;
    email?: string;
  };
  order?: {
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

const tableHeading = {
  textTransform: "uppercase" as const,
  fontWeight: 600,
  color: emailTheme.colors.muted,
  fontSize: "12px",
  padding: "0 0 4px",
};

const headingCell = {
  fontWeight: 500,
  color: emailTheme.colors.text,
  fontSize: "16px",
  margin: 0,
};

const paragraph = {
  margin: "0 0 24px",
  fontSize: "15px",
  lineHeight: "160%",
  color: "#4b5563",
};

const summaryRow = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: 0,
};

const totalRow = {
  fontSize: "20px",
  lineHeight: "120%",
  color: emailTheme.colors.text,
  fontWeight: 600,
  margin: 0,
};

export const OrderConfirmationEmail = ({
  tenant = {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    contact: "info@spielportugal.org",
    socialNetworks: { facebook: "", instagram: "", x: "" },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
  },
  edition = { name: "" },
  customer = {
    name: "Alexander",
    email: "alexander@the.great",
  },
  order = {
    orderId: "#682304",
    orderDate: "19 December 2022",
    orderLink: "https://example.com/orders/682304",
    subtotal: "$189",
    shipping: "$5",
    tax: "$3",
    totalAmount: "$196",
    billingAddress: [
      "Joshua M Arriaga",
      "1673 Philadelphia Avenue",
      "Wisconsin, 54818",
    ],
    items: [
      {
        name: "Magical notebook",
        category: "Superheroes things",
        quantity: 1,
        price: "$399",
        imageUrl: "https://placehold.co/64x64/f6f6f6/667382?text=1",
      },
      {
        name: "Dragonfly eyes",
        category: "Unnecessary things",
        quantity: 1,
        price: "$145",
        imageUrl: "https://placehold.co/64x64/f6f6f6/667382?text=2",
      },
      {
        name: "Fireman's pipe",
        category: "Kitchen items",
        quantity: 1,
        price: "$400",
        imageUrl: "https://placehold.co/64x64/f6f6f6/667382?text=3",
      },
    ],
  },
}: OrderConfirmationEmailProps) => (
  <EmailLayout
    preview={`Your order ${order.orderId} has been placed`}
    title="Order summary"
    subtitle=""
    brandName="congrem.io"
    brandLogoUrl={tenant.logoUrl}
    supportEmail={tenant.contact}
    logoPlaceholderText="CE"
    heroIcon={IconShoppingCart}
    url={tenant?.url}
  >
    <Section style={styles.section}>
      <Text style={paragraph}>Hey {customer?.name},</Text>
      <Text style={paragraph}>
        Your order <strong>#{order.orderId}</strong>{" "}
        has successfully been placed. You will find all the details below and we
        will send the tickets after we receive the payment confirmation.
      </Text>
    </Section>

    <Section style={styles.section}>
      <Row>
        <Column style={{ width: "72px" }}>
          <Text style={tableHeading}></Text>
        </Column>
        <Column>
          <Text style={tableHeading}></Text>
        </Column>
        <Column align="center" style={{ width: "50px" }}>
          <Text style={tableHeading}>Qty</Text>
        </Column>
        <Column align="right" style={{ width: "80px" }}>
          <Text style={tableHeading}>Price</Text>
        </Column>
      </Row>

      {(order.items ?? []).map((item) => (
        <Row key={`${item.name}-${item.price}`}>
          {/*<Column style={{ width: "72px", padding: "4px 8px 4px 0" }}>*/}
          {/*  <Img*/}
          {/*    src={item.imageUrl}*/}
          {/*    width="64"*/}
          {/*    height="64"*/}
          {/*    alt={item.name}*/}
          {/*    style={{ borderRadius: "4px", backgroundColor: "#f6f6f6" }}*/}
          {/*  />*/}
          {/*</Column>*/}
          <Column style={{ padding: "0" }}>
            <Text style={{ ...summaryRow, margin: 0 }}>
              <strong style={{ color: emailTheme.colors.text }}>
                {item.name}
              </strong>
              <br />
              <span style={{ color: emailTheme.colors.muted }}>
                {item.category ?? ""}
              </span>
            </Text>
          </Column>
          <Column align="center" style={{ width: "50px", padding: "4px 8px" }}>
            <Text style={{ ...summaryRow, margin: 0 }}>{item.quantity}</Text>
          </Column>
          <Column
            align="right"
            style={{ width: "80px", padding: "4px 0 4px 8px" }}
          >
            <Text style={{ ...summaryRow, margin: 0 }}>{item.price}</Text>
          </Column>
        </Row>
      ))}

      {/*<Row>*/}
      {/*  <Column style={{ borderTop: `1px solid ${emailTheme.colors.border}` }}>*/}
      {/*    <Text*/}
      {/*      style={{ ...summaryRow, textAlign: "right", paddingTop: "8px" }}*/}
      {/*    >*/}
      {/*      Subtotal*/}
      {/*    </Text>*/}
      {/*  </Column>*/}
      {/*  <Column*/}
      {/*    align="right"*/}
      {/*    style={{*/}
      {/*      width: "90px",*/}
      {/*      borderTop: `1px solid ${emailTheme.colors.border}`,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Text*/}
      {/*      style={{ ...summaryRow, textAlign: "right", paddingTop: "8px" }}*/}
      {/*    >*/}
      {/*      {order.subtotal}*/}
      {/*    </Text>*/}
      {/*  </Column>*/}
      {/*</Row>*/}
      {/*<Row>*/}
      {/*  <Column>*/}
      {/*    <Text style={{ ...summaryRow, textAlign: "right" }}>Shipping</Text>*/}
      {/*  </Column>*/}
      {/*</Row>*/}
      {/*<Row>*/}
      {/*  <Column>*/}
      {/*    <Text style={{ ...summaryRow, textAlign: "right" }}>Tax</Text>*/}
      {/*  </Column>*/}
      {/*  <Column align="right" style={{ width: "90px" }}>*/}
      {/*    <Text style={{ ...summaryRow, textAlign: "right" }}>{order.tax}</Text>*/}
      {/*  </Column>*/}
      {/*</Row>*/}
      <Row>
        <Column>
          <Text style={{ ...totalRow, textAlign: "right" }}>Total</Text>
        </Column>
        <Column align="right" style={{ width: "90px" }}>
          <Text style={{ ...totalRow, textAlign: "right" }}>
            {order.totalAmount}
          </Text>
        </Column>
      </Row>
    </Section>

    <Section style={styles.section}>
      <Row style={{ marginBottom: "16px" }}>
        <Column>
          <Text style={headingCell}>Order number</Text>
          <Text style={summaryRow}>{order.orderId}</Text>
        </Column>
        <Column>
          <Text style={headingCell}>Order date</Text>
          <Text style={summaryRow}>{order.orderDate}</Text>
        </Column>
      </Row>
      {/*<Row>*/}
      {/*  <Column style={{}}>*/}
      {/*    <Text style={headingCell}>Billing address</Text>*/}
      {/*    <Text style={summaryRow}>*/}
      {/*      {order.billingAddress.join("\n")}*/}
      {/*    </Text>*/}
      {/*  </Column>*/}
      {/*</Row>*/}
    </Section>

    {/*<Section style={styles.section}>*/}
    {/*  <Text style={{ ...summaryRow, margin: 0 }}>*/}
    {/*    You can review this order anytime in your account:{" "}*/}
    {/*    <Link*/}
    {/*      href={order.orderLink}*/}
    {/*      style={{ color: emailTheme.colors.primary, textDecoration: "none" }}*/}
    {/*    >*/}
    {/*      {order.orderLink}*/}
    {/*    </Link>*/}
    {/*  </Text>*/}
    {/*</Section>*/}
  </EmailLayout>
);

OrderConfirmationEmail.PreviewProps = {
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
  customer: {
    name: "Alexander",
    email: "alexander@the.great",
  },
  order: {
    orderId: "#682304",
    orderDate: "19 December 2022",
    orderLink: "https://example.com/orders/682304",
    subtotal: "$189",
    tax: "$3",
    totalAmount: "$196",
    billingAddress: [
      "Joshua M Arriaga",
      "1673 Philadelphia Avenue",
      "Wisconsin, 54818",
    ],
    items: [
      {
        name: "Magical notebook",
        category: "Superheroes things",
        quantity: 1,
        price: "$399",
        imageUrl: "https://placehold.co/64x64/f6f6f6/667382?text=1",
      },
      {
        name: "Dragonfly eyes",
        category: "Unnecessary things",
        quantity: 1,
        price: "$145",
        imageUrl: "https://placehold.co/64x64/f6f6f6/667382?text=2",
      },
      {
        name: "Fireman's pipe",
        category: "Kitchen items",
        quantity: 1,
        price: "$400",
        imageUrl: "https://placehold.co/64x64/f6f6f6/667382?text=3",
      },
    ],
  },
} as OrderConfirmationEmailProps;

export default OrderConfirmationEmail;
