// @ts-nocheck
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
  Text,
} from "react-email";
import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
} from "@tabler/icons-react";

import { styles } from "./email-theme.ts";

export interface EmailLayoutProps {
  preview: string;
  title: string;
  subtitle: string;
  brandName: string;
  brandLogoUrl?: string;
  logoPlaceholderText?: string;
  viewOnlineUrl?: string;
  heroIcon?: Icon;
  supportEmail?: string;
  unsubscribeUrl?: string;
  copyrightName?: string;
  footerText?: string;
  children: ReactNode;
  socialNetworks?: {
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  url?: string;
}

const getLogoPlaceholder = (brandName: string) => {
  const letters = brandName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return letters || "LG";
};

export const EmailLayout = ({
  preview,
  title,
  subtitle,
  brandName,
  brandLogoUrl,
  logoPlaceholderText,
  viewOnlineUrl,
  heroIcon: HeroIcon,
  supportEmail,
  copyrightName,
  footerText,
  children,
  socialNetworks,
  url,
}: EmailLayoutProps) => (
  <Html>
    <Head>
      {
        /* Tell email clients this layout supports both schemes so they
          can invert our inline styles naturally in dark mode */
      }
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <style>{`:root { color-scheme: light dark; }`}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body style={styles.body}>
      <Container style={styles.shell}>
        <Container style={styles.wrap}>
          <Section style={styles.headerRow}>
            <Row>
              <Column>
                {brandLogoUrl
                  ? (
                    <Link href={url}>
                      <Img
                        src={brandLogoUrl}
                        height="64"
                        alt={brandName}
                        style={styles.brandLogo}
                      />
                    </Link>
                  )
                  : (
                    <Text style={styles.logoPlaceholder}>
                      {logoPlaceholderText ?? getLogoPlaceholder(brandName)}
                    </Text>
                  )}
              </Column>
              <Column align="right">
                {/*<Link*/}
                {/*  href={viewOnlineUrl ?? ""}*/}
                {/*  style={styles.headerLink}*/}
                {/*>*/}
                {/*  View online*/}
                {/*</Link>*/}
              </Column>
            </Row>
          </Section>

          <Container style={styles.card}>
            <Section style={styles.hero}>
              {HeroIcon
                ? (
                  <Section style={styles.heroIconWrap}>
                    <Row>
                      <Column align="center" style={styles.heroIcon}>
                        <HeroIcon size={40} stroke={1.75} color="#ffffff" />
                      </Column>
                    </Row>
                  </Section>
                )
                : null}
              <Heading style={styles.title}>{title}</Heading>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </Section>

            <Section style={styles.content}>{children}</Section>
          </Container>

          <Section style={styles.footer}>
            <Section style={styles.footerLinks}>
              {socialNetworks?.facebook
                ? (
                  <Link
                    href={socialNetworks.facebook}
                    style={styles.footerIcon}
                  >
                    <IconBrandFacebookFilled />
                  </Link>
                )
                : null}
              {socialNetworks?.instagram
                ? (
                  <Link
                    href={socialNetworks.instagram}
                    style={styles.footerIcon}
                  >
                    <IconBrandInstagram />
                  </Link>
                )
                : null}
            </Section>
            <Text style={styles.footerText}>
              {footerText ??
                `If you have any questions, feel free to contact us at ${
                  supportEmail ?? "info@congrem.io"
                }.`}
            </Text>
            {/*<Text style={styles.footerText}>*/}
            {/*  You are receiving this email because you have an active account or order with {brandName}.{' '}*/}
            {/*  <Link*/}
            {/*    href={unsubscribeUrl ?? 'https://example.com/unsubscribe'}*/}
            {/*    style={{ color: '#066fd1', textDecoration: 'none' }}*/}
            {/*  >*/}
            {/*    Unsubscribe*/}
            {/*  </Link>*/}
            {/*</Text>*/}
            <Text style={styles.footerLast}>
              Copyright {new Date().getFullYear()}{" "}
              {copyrightName ?? brandName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Container>
    </Body>
  </Html>
);
