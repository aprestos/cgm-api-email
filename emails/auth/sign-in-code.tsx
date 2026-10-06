import { Section, Text } from "react-email";

import { EmailLayout } from "../../components/email-layout";
import { Paragraph } from "../../components/email-ui";
import { congremBrand, type EmailModel } from "../../models/email";

export interface SignInCodeContent {
  code: string;
}

/** The code that signs someone in, sent by the Supabase Send Email hook. */
export const SignInCodeEmail = ({
  brand,
  recipient,
  content: { code },
}: EmailModel<SignInCodeContent>) => (
  <EmailLayout
    preview={`${code} is your ${brand.name} sign-in code`}
    icon="lock"
    title="Your sign-in code"
    subtitle={`${recipient.name ? `Hi ${recipient.name}, enter` : "Enter"} this code to sign in to ${brand.name}.`}
    brand={brand}
  >
    <Section className="rounded-[12px] border border-solid border-neutral-200 bg-neutral-50 px-6 py-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
      <Text
        className="mobile:text-[28px] my-0 text-[34px] leading-[40px] font-semibold text-neutral-900 dark:text-white"
        // letter-spacing also trails the last digit; indent by as much to re-centre
        style={{ letterSpacing: "0.3em", textIndent: "0.3em" }}
      >
        {code}
      </Text>
    </Section>

    <Paragraph className="mt-6">
      Do not share this code with anyone. If you did not try to sign in, you
      can safely ignore this email.
    </Paragraph>
  </EmailLayout>
);

SignInCodeEmail.PreviewProps = {
  brand: congremBrand,
  recipient: { name: "Alexander", email: "alexander@example.com" },
  content: { code: "305805" },
} satisfies EmailModel<SignInCodeContent>;

export default SignInCodeEmail;
