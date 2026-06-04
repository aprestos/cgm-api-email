// @ts-nocheck
import { Button } from "react-email";

import { emailTheme } from "./email-theme.ts";

interface CtaButtonProps {
  href: string;
  label: string;
}

export const CtaButton = ({ href, label }: CtaButtonProps) => (
  <Button
    href={href}
    style={{
      display: "block",
      backgroundColor: emailTheme.colors.primary,
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: 500,
      textDecoration: "none",
      textAlign: "center",
      borderRadius: "8px",
      border: `1px solid ${emailTheme.colors.primary}`,
      padding: "12px 32px",
      marginTop: "16px",
    }}
  >
    {label}
  </Button>
);
