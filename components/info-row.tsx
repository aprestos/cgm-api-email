// @ts-nocheck
import { Row, Text } from "react-email";
import type { ReactNode } from "react";

import { emailTheme } from "./email-theme.ts";

interface InfoRowProps {
  label?: string;
  value: string;
  icon?: ReactNode;
}

export const InfoRow = ({ label, value, icon }: InfoRowProps) => (
  <Row>
    <Text
      style={{
        margin: "0 0 10px",
        fontSize: "14px",
        lineHeight: "21px",
        color: emailTheme.colors.text,
      }}
    >
      {icon ? <span style={{ marginRight: "6px" }}>{icon}</span> : null}
      {label
        ? (
          <span style={{ color: emailTheme.colors.muted, marginRight: "6px" }}>
            {label}:
          </span>
        )
        : null}
      {value}
    </Text>
  </Row>
);
