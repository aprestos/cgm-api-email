import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";
import type { ReactNode } from "react";

import { congremBrand, type EmailBrand } from "../models/email";
import { brandColors, brandCss, darkPage } from "./brand-colors";
import { line } from "./email-ui";
import { emailTailwindConfig } from "./email-theme";

/*
 * The icons live in public Supabase storage: a mail client fetches them when
 * the email is opened, so they need a public, absolute URL. They are PNGs
 * because Gmail and Outlook drop inline SVG.
 */
export const iconsUrl =
  "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/app/mail";

// the page colour, light and dark
const pageCss = `
  body { background-color: #ffffff; }
  @media (prefers-color-scheme: dark) {
    body { background-color: ${darkPage} !important; }
  }
`;

const socialLinks = [
  { network: "facebook", label: "Facebook" },
  { network: "instagram", label: "Instagram" },
  { network: "x", label: "X" },
] as const;

/*
 * The frame every email shares: one roomy column on a white page, the
 * logo, a large title with a short bar of the brand colour under it, the
 * email's own content, and the footer with the social links.
 *
 * On a phone it keeps one column with tighter padding and a smaller title;
 * in dark mode the page turns near-black.
 */
export const EmailLayout = ({
  preview,
  title,
  brand,
  footerText,
  children,
}: {
  preview: string;
  title: string;
  brand: EmailBrand;
  footerText?: string;
  children: ReactNode;
}) => {
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
          {/* The page colour, set here rather than as a class on <Body>:
              react-email moves <Body>'s inline style onto an inner cell, where
              it would cover the dark one. */}
          <style>{pageCss + brandCss(brand)}</style>
        </Head>
        <Preview>{preview}</Preview>
        <Body className="m-0 font-sans">
          {/* the padding sits here, not on <Container>: Container moves it onto
              its inner <td> but leaves the class on the <table>, so mobile:
              could never override it */}
          <Section className="mobile:px-4 mobile:py-6 bg-white px-8 py-12 dark:bg-[#161616]">
            <Container className="mx-auto w-full max-w-[516px]">
              {logoUrl
                ? (
                  <Link href={url}>
                    <Img
                      src={logoUrl}
                      alt={brandName}
                      height={40}
                      className="block h-[40px] w-auto max-w-[200px]"
                    />
                  </Link>
                )
                : (
                  <Text className="m-0 text-[20px] leading-[28px] font-bold text-[#222222] dark:text-white">
                    {brandName}
                  </Text>
                )}

              <Heading
                as="h1"
                className="mobile:mt-6 mobile:text-[26px] mobile:leading-[32px] m-0 mt-10 text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-[#222222] dark:text-white"
              >
                {title}
              </Heading>
              {/* the brand's mark: a short bar under the title */}
              <Section
                align="left"
                className="brand-fill mt-4"
                style={{
                  width: 48,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: brandColors(brand).color,
                  fontSize: 0,
                  lineHeight: 0,
                }}
              >
                &nbsp;
              </Section>

              <Section className="mobile:mt-6 mt-8">{children}</Section>

              <Section className={`${line} mobile:mt-8 mobile:pt-6 mt-12 border-t pt-8`}>
                {socials.length > 0
                  ? (
                    <Section className="mb-4">
                      {socials.map(({ network, label }) => (
                        <Link
                          key={network}
                          href={socialNetworks?.[network]}
                          className="inline-block pr-3 align-middle"
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
                <Text className="m-0 text-[14px] leading-[22px] text-[#6a6a6a] dark:text-[#b0b0b0]">
                  {footerText ??
                    `Have a question? Write to us at ${
                      brand.contact ?? congremBrand.contact
                    }.`}
                </Text>
                <Text className="m-0 mt-2 text-[14px] leading-[22px] text-[#6a6a6a] dark:text-[#b0b0b0]">
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
