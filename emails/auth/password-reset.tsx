import { Link, Section, Text } from "react-email";

import { EmailLayout } from "../../components/email-layout";
import { EmailButton, Paragraph } from "../../components/email-ui";
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
    icon="lock"
    title="Reset your password"
    subtitle={`${recipient.name ? `Hi ${recipient.name}, we` : "We"} received a request to reset the password of your ${brand.name} account.`}
    brand={brand}
  >
    <EmailButton href={resetUrl}>Reset password</EmailButton>

    <Paragraph className="mt-8">
      The link can only be used once. If you did not ask to reset your
      password, you can safely ignore this email: your password stays the same
      until you set a new one.
    </Paragraph>

    <Section className="mt-8 border-0 border-t border-solid border-neutral-200 pt-6 dark:border-neutral-700">
      <Text className="mt-0 mb-1 text-[13px] leading-[20px] text-neutral-500 dark:text-neutral-400">
        If the button does not work, copy this link into your browser:
      </Text>
      <Link
        href={resetUrl}
        className="block text-[13px] leading-[20px] break-all text-indigo-600 no-underline dark:text-indigo-400"
      >
        {resetUrl}
      </Link>
    </Section>
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
