// @ts-nocheck
import { Row, Section, Text } from "react-email";

import { emailTheme } from "./email-theme.ts";

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: string;
}

interface OrderItemsTableProps {
  items: OrderItem[];
}

export const OrderItemsTable = ({ items }: OrderItemsTableProps) => (
  <Section>
    {items.map((item, index) => (
      <Row key={`${item.name}-${index}`}>
        <Text
          style={{
            margin: "0",
            fontSize: "15px",
            lineHeight: "24px",
            color: emailTheme.colors.text,
            borderBottom: `1px solid ${emailTheme.colors.border}`,
            padding: "10px 0",
          }}
        >
          <strong>{item.name}</strong>
          <span style={{ color: emailTheme.colors.muted }}>
            x{item.quantity}
          </span>
          <span style={{ float: "right", fontWeight: 700 }}>
            {item.unitPrice}
          </span>
        </Text>
      </Row>
    ))}
  </Section>
);
