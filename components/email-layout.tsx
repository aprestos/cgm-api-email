import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";
import type { ReactNode } from "react";

import { congremBrand, type EmailBrand } from "../models/email";
import { EmailFonts } from "./email-fonts";
import { emailTailwindConfig } from "./email-theme";

/*
 * The icons live in public Supabase storage: a mail client fetches them when
 * the email is opened, so they need a public, absolute URL. They are PNGs
 * because Gmail and Outlook drop inline SVG.
 */
const iconsUrl =
  "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/app/mail";

// neutral-100 and neutral-950, the colours of the wrapper inside <Body>
const pageCss = `
  body { background-color: #f5f5f5; }
  @media (prefers-color-scheme: dark) {
    body { background-color: #0a0a0a !important; }
  }
`;

const socialLinks = [
  { network: "facebook", label: "Facebook" },
  { network: "instagram", label: "Instagram" },
  { network: "x", label: "X" },
] as const;

/**
 * The header icons, `icon-*.png` in `iconsUrl`: Tabler icons in #615FFF
 * (indigo-500) at 72px, a colour that reads on the light and the dark tile.
 */
export type EmailIcon = "cart" | "refund" | "ticket" | "lock";

export interface EmailLayoutProps {
  preview: string;
  icon?: EmailIcon;
  /** Small indigo label above the title. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  brand: EmailBrand;
  footerText?: string;
  children: ReactNode;
}

/*
 * The frame every email shares: a white card on a neutral grey page, with the
 * logo, a header (icon, eyebrow, title, subtitle) and the email's own content;
 * under it, the footer with the social links. Indigo stays an accent: the
 * icon, the eyebrow and the button.
 *
 * On a screen narrower than the card it goes edge to edge, and in dark mode
 * the page and the card turn neutral-950 and neutral-900.
 */
export const EmailLayout = ({
  preview,
  icon,
  eyebrow,
  title,
  subtitle,
  brand,
  footerText,
  children,
}: EmailLayoutProps) => {
  const { name: brandName, logoUrl, url, socialNetworks } = brand;
  const socials = socialLinks.filter(({ network }) => socialNetworks?.[network]);

  return (
    <Tailwind config={emailTailwindConfig}>
      <Html lang="en">
        <Head>
          {/* without these, Apple Mail inverts the light colours by itself
              instead of applying the dark: ones */}
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <EmailFonts />
          {/* The page colour, set here rather than as a class on <Body>:
              react-email moves <Body>'s inline style onto an inner cell, where
              it would cover the dark one. */}
          <style>{pageCss}</style>
        </Head>
        <Preview>{preview}</Preview>
        <Body className="m-0 font-sans">
          <Section className="bg-neutral-100 dark:bg-neutral-950">
            <Container className="tablet:py-0 mx-auto w-full max-w-[600px] py-10">
              <Section className="tablet:rounded-none tablet:border-x-0 overflow-hidden rounded-[16px] border border-solid border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <Section className="mobile:px-6 mobile:pt-6 px-10 pt-8">
                  {logoUrl
                    ? (
                      <Link href={url}>
                        <Img
                          src={logoUrl}
                          alt={brandName}
                          height={40}
                          className="block h-[40px] w-auto max-w-[180px]"
                        />
                      </Link>
                    )
                    : (
                      <Text className="m-0 text-[18px] leading-[28px] font-semibold tracking-tight text-neutral-900 dark:text-white">
                        {brandName}
                      </Text>
                    )}
                </Section>

                <Section className="mobile:px-6 mobile:pt-8 mobile:pb-8 px-10 pt-10 pb-10">
                  {icon
                    ? (
                      <Row className="mb-6">
                        <Column
                          align="center"
                          className="h-[46px] w-[46px] rounded-[12px] border border-solid border-neutral-200 bg-neutral-50 align-middle dark:border-neutral-700 dark:bg-neutral-800"
                        >
                          <Img
                            src={`${iconsUrl}/icon-${icon}.png`}
                            alt=""
                            width={24}
                            height={24}
                            className="mx-auto block"
                          />
                        </Column>
                        <Column />
                      </Row>
                    )
                    : null}

                  {eyebrow
                    ? (
                      <Text className="m-0 mb-2 text-[13px] leading-[20px] font-semibold tracking-[0.06em] text-indigo-600 uppercase dark:text-indigo-400">
                        {eyebrow}
                      </Text>
                    )
                    : null}
                  <Heading
                    as="h1"
                    className="mobile:text-[24px] mobile:leading-[32px] m-0 text-[28px] leading-[36px] font-semibold tracking-tight text-neutral-900 dark:text-white"
                  >
                    {title}
                  </Heading>
                  {subtitle
                    ? (
                      <Text className="m-0 mt-3 text-[16px] leading-[26px] text-neutral-600 dark:text-neutral-300">
                        {subtitle}
                      </Text>
                    )
                    : null}

                  <Section className="mt-8">{children}</Section>
                </Section>
              </Section>

              <Section className="mobile:px-6 px-10 py-8 text-center">
                {socials.length > 0
                  ? (
                    <Section className="mb-5">
                      {socials.map(({ network, label }) => (
                        <Link
                          key={network}
                          href={socialNetworks?.[network]}
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${iconsUrl}/social-${network}.png`}
                            alt={label}
                            width={18}
                            height={18}
                            className="block"
                          />
                        </Link>
                      ))}
                    </Section>
                  )
                  : null}

                <Text className="mx-auto my-0 max-w-[420px] text-[13px] leading-[20px] text-neutral-500 dark:text-neutral-400">
                  {footerText ??
                    `If you have any questions, feel free to contact us at ${
                      brand.contact ?? congremBrand.contact
                    }.`}
                </Text>
                <Text className="m-0 mt-2 text-[12px] leading-[18px] text-neutral-400 dark:text-neutral-500">
                  © {new Date().getFullYear()} {brandName}. All rights reserved.
                </Text>
              </Section>
            </Container>
          </Section>
        </Body>
      </Html>
    </Tailwind>
  );
};
