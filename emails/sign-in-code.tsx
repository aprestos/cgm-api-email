import { Section, Text } from "react-email";

import { EmailLayout } from "../components/email-layout";
import { emailTheme, styles } from "../components/email-theme";

export interface SignInCodeEmailProps {
  code: string;
  name?: string;
  /** Absolute URL of the congrem logo; without it the header shows the wordmark as text. */
  logoUrl?: string;
}

const centerParagraph = {
  margin: "0 0 24px",
  fontSize: "15px",
  lineHeight: "160%",
  color: "#4b5563",
  textAlign: "center" as const,
};

const codeBox = {
  margin: "0 auto",
  padding: "16px 24px",
  backgroundColor: emailTheme.colors.background,
  border: `1px solid ${emailTheme.colors.border}`,
  borderRadius: emailTheme.radius.card,
  fontSize: "32px",
  lineHeight: "40px",
  fontWeight: 600,
  letterSpacing: "0.3em",
  // letter-spacing also trails the last digit; indent by as much to re-centre
  textIndent: "0.3em",
  color: emailTheme.colors.text,
  textAlign: "center" as const,
};

/*
 * The code that signs someone in, sent by the Supabase Send Email hook.
 *
 * It carries congrem's branding rather than a tenant's: the hook cannot tell
 * which tenant the sign-in started on, and the `tenant_name` in user metadata
 * is the tenant the account was created on, which is not necessarily this one.
 */
export const SignInCodeEmail = ({
  code = "123456",
  name,
  logoUrl,
}: SignInCodeEmailProps) => (
  <EmailLayout
    preview={`${code} is your congrem sign-in code`}
    title="Your sign-in code"
    subtitle={name ? `Hi ${name}, enter this code to sign in.` : "Enter this code to sign in."}
    brandName="congrem"
    brandLogoUrl={logoUrl}
    logoPlaceholderText="congrem"
    footerText="If you did not try to sign in, you can safely ignore this email."
  >
    <Section style={styles.section}>
      <Text style={codeBox}>{code}</Text>
      <Text style={{ ...centerParagraph, margin: "24px 0 0" }}>
        Do not share this code with anyone.
      </Text>
    </Section>
  </EmailLayout>
);

SignInCodeEmail.PreviewProps = {
  code: "305805",
  name: "Alexander",
  // `email dev` serves `static/` at /static
  logoUrl: "/static/congrem-logo-green@2x.png",
} as SignInCodeEmailProps;

export default SignInCodeEmail;
