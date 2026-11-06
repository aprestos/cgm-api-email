import { Column, Link, Row, Text } from "react-email";

import { brandColors } from "../../components/brand-colors";
import { EmailLayout } from "../../components/email-layout";
import { EmailButton, fullWidth, Greeting, line, Paragraph } from "../../components/email-ui";
import { congremBrand, type EmailModel } from "../../models/email";

export interface PasswordResetContent {
  /** Supabase's verify link; it signs the user in and redirects to where they set the new password. */
  resetUrl: string;
}

/** The link to set a new password, sent by the Supabase Send Email hook. */
export const PasswordResetEmail = ({
  brand,
  recipient,
  content: { resetUrl },
}: EmailModel<PasswordResetContent>) => (
  <EmailLayout
    preview={`Reset your ${brand.name} password`}
    title="Reset your password"
    brand={brand}
  >
    <Greeting name={recipient.name} />
    <Paragraph>
      We got a request to reset your {brand.name} password. Choose a new one
      with the button below.
    </Paragraph>

    <Row className={fullWidth}>
      <Column className="pt-6">
        <EmailButton brand={brand} href={resetUrl}>Choose a new password</EmailButton>
      </Column>
    </Row>

    <Paragraph muted className="mt-6">
      The link works only once. If you didn&apos;t ask for this, you can ignore
      this email and your password stays the same.
    </Paragraph>

    <Row className={fullWidth}>
      <Column className="pt-8">
        <Row className={fullWidth}>
          <Column className={`${line} border-t pt-6`}>
            <Text className="mt-0 mb-1 text-[14px] leading-[20px] text-[#6a6a6a] dark:text-[#b0b0b0]">
              Button not working? Paste this link into your browser:
            </Text>
            <Link
              href={resetUrl}
              className="brand-text block text-[14px] leading-[20px] break-all no-underline"
              style={{ color: brandColors(brand).text }}
            >
              {resetUrl}
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </EmailLayout>
);

PasswordResetEmail.PreviewProps = {
  brand: congremBrand,
  recipient: { name: "Alexander", email: "alexander@example.com" },
  content: {
    resetUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/auth/v1/verify?token=pkce_8f1c2e9a4b&type=recovery&redirect_to=https%3A%2F%2Fcongrem.com%2Freset-password",
  },
} satisfies EmailModel<PasswordResetContent>;

export default PasswordResetEmail;
