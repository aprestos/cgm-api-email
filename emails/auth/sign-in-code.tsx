import { Column, Row, Text } from "react-email";

import { EmailLayout } from "../../components/email-layout";
import { fullWidth, Greeting, Paragraph } from "../../components/email-ui";
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
    title="Your sign-in code"
    brand={brand}
  >
    <Greeting name={recipient.name} />
    <Paragraph>Use this code to sign in to {brand.name}.</Paragraph>
    <Row className={fullWidth}>
      <Column className="pt-6">
        <Row className={fullWidth}>
          <Column
            align="center"
            className="rounded-[16px] bg-[#f7f7f7] py-6 text-center dark:bg-[#262626]"
          >
            <Text
              className="mobile:text-[32px] mobile:leading-[40px] m-0 text-[40px] leading-[48px] font-bold text-[#222222] dark:text-white"
              // letter-spacing also trails the last digit; indent by as much to re-centre
              style={{ letterSpacing: "0.25em", textIndent: "0.25em" }}
            >
              {code}
            </Text>
          </Column>
        </Row>
      </Column>
    </Row>
    <Paragraph muted className="mt-6">
      Never share this code with anyone. If you didn&apos;t try to sign in, you
      can ignore this email.
    </Paragraph>
  </EmailLayout>
);

SignInCodeEmail.PreviewProps = {
  brand: congremBrand,
  recipient: { name: "Alexander", email: "alexander@example.com" },
  content: { code: "305805" },
} satisfies EmailModel<SignInCodeContent>;

export default SignInCodeEmail;
