import type { CSSProperties } from "react";

export const emailTheme = {
  colors: {
    background: "#f9fafb",
    panel: "#ffffff",
    text: "#111827",
    muted: "#667382",
    border: "#e8ebee",
    primary: "#066fd1",
    success: "#2ca73f",
    logoPlaceholder: "#f3f5f7",
  },
  radius: {
    card: "8px",
    pill: "9999px",
  },
  spacing: {
    container: "48px",
    section: "24px",
  },
};

export const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: emailTheme.colors.background,
    margin: 0,
    padding: 0,
    fontFamily:
      'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "160%",
  },
  shell: {
    width: "100%",
    backgroundColor: emailTheme.colors.background,
    padding: "8px",
  },
  wrap: {
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
  },
  headerRow: {
    paddingTop: "24px",
    paddingBottom: "24px",
  },
  headerLink: {
    fontSize: "14px",
    color: "#8491a1",
    textDecoration: "none",
  },
  brandLogo: {
    display: "block",
    height: "48px",
    maxHeight: "48px",
    width: "auto",
    maxWidth: "180px",
  },
  logoPlaceholder: {
    display: "inline-block",
    width: "114px",
    height: "32px",
    lineHeight: "32px",
    textAlign: "center",
    backgroundColor: emailTheme.colors.logoPlaceholder,
    border: `1px solid ${emailTheme.colors.border}`,
    borderRadius: "6px",
    color: "#405066",
    letterSpacing: "0.14em",
    fontWeight: 700,
    fontSize: "12px",
  },
  card: {
    backgroundColor: emailTheme.colors.panel,
    // rgba outline inverts gracefully — avoids hard-coded light border in dark mode
    boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 1px 4px rgba(0, 0, 0, 0.06)",
    borderRadius: emailTheme.radius.card,
    overflow: "hidden",
  },
  hero: {
    padding: "48px 48px 24px",
    textAlign: "center",
  },
  heroIconWrap: {
    width: "80px",
    height: "80px",
    borderRadius: emailTheme.radius.pill,
    backgroundColor: "#e8f1fb",
    margin: "0 auto",
    overflow: "hidden",
  },
  heroIcon: {
    width: "80px",
    padding: "20px", // (80 - 40) / 2  →  centres a 40px icon
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: "0",
    fontSize: "0",
    color: emailTheme.colors.primary,
  },
  title: {
    fontSize: "30px",
    lineHeight: "126%",
    fontWeight: 600,
    color: emailTheme.colors.text,
    margin: "16px 0 0",
  },
  subtitle: {
    fontSize: "15px",
    lineHeight: "160%",
    color: "#4b5563",
    margin: "16px 0 0",
  },
  section: {
    border: `0px solid ${emailTheme.colors.border}`,
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    padding: emailTheme.spacing.section,
    marginTop: "16px",
  },
  content: {
    padding: "0 20px 20px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "120%",
    color: emailTheme.colors.text,
    margin: "0 0 10px",
  },
  paragraph: {
    fontSize: "14px",
    lineHeight: "22px",
    color: emailTheme.colors.text,
    margin: "0 0 12px",
  },
  footer: {
    fontSize: "12px",
    lineHeight: "20px",
    color: emailTheme.colors.muted,
    textAlign: "center",
    padding: "48px 24px",
  },
  footerText: {
    fontSize: "12px",
    lineHeight: "20px",
    color: emailTheme.colors.muted,
    textAlign: "center",
    margin: "0 0 12px",
  },
  footerLast: {
    fontSize: "12px",
    lineHeight: "20px",
    color: emailTheme.colors.muted,
    textAlign: "center",
    margin: 0,
  },
  footerLinks: {
    marginBottom: "16px",
  },
  footerIcon: {
    display: "inline-block",
    padding: "7px",
    borderRadius: emailTheme.radius.pill,
    backgroundColor: "#dce2e8",
    textDecoration: "none",
    lineHeight: "0",
    fontSize: "0",
    margin: "0 4px",
  },
};
