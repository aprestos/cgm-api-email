import { Button, Column, Row, Section, Text } from "react-email";
import type { ReactNode } from "react";

import type { EmailBrand } from "../models/email";
import { brandColors } from "./brand-colors";

/*
 * Building blocks for the content of an `EmailLayout`. None of them sets an
 * outer margin; the email spaces them with `className`. Two classes for the
 * same property (say `mb-0` and `mb-4`) do not override each other in a
 * predictable order, so a block never sets what its caller would.
 */

export const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/** The hairline colour, for `border-*` classes. */
export const line =
  "border-0 border-solid border-[#dddddd] dark:border-[#3a3a3a]";

export const Paragraph = ({
  children,
  muted,
  className,
}: {
  children: ReactNode;
  /** Smaller and grey, for what comes after the point of the email. */
  muted?: boolean;
  className?: string;
}) => (
  <Text
    className={cx(
      "m-0",
      muted
        ? "text-[15px] leading-[24px] text-[#6a6a6a] dark:text-[#b0b0b0]"
        : "text-[17px] leading-[26px] text-[#222222] dark:text-[#e5e5e5]",
      className,
    )}
  >
    {children}
  </Text>
);

/** How every email opens: "Hi Alex," or, without a name, "Hi,". */
export const Greeting = ({ name }: { name?: string }) => (
  <Paragraph className="mb-4">Hi{name ? ` ${name}` : ""},</Paragraph>
);

/** Emphasis inside a `Paragraph`. */
export const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold text-[#222222] dark:text-white">
    {children}
  </strong>
);

/** A rounded, outlined box that groups related content. */
export const Box = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Section className={cx(line, "mobile:px-5 rounded-[16px] border px-6", className)}>
    {children}
  </Section>
);

/** The heading of a `Box`, with an optional grey line under it. */
export const BoxTitle = ({
  children,
  detail,
}: {
  children: ReactNode;
  detail?: ReactNode;
}) => (
  <Section className="pt-5 pb-3">
    <Text className="m-0 text-[20px] leading-[26px] font-bold text-[#222222] dark:text-white">
      {children}
    </Text>
    {detail
      ? (
        <Text className="m-0 mt-1 text-[14px] leading-[20px] text-[#6a6a6a] dark:text-[#b0b0b0]">
          {detail}
        </Text>
      )
      : null}
  </Section>
);

/** A row in a `Box`, under a hairline. */
export const BoxRow = ({ children }: { children: ReactNode }) => (
  <Row className={cx(line, "border-t")}>{children}</Row>
);

export interface Detail {
  label: string;
  value: ReactNode;
}

/** Label / value rows in a `Box`. */
export const DetailsList = ({ details }: { details: Detail[] }) => (
  <>
    {details.map(({ label, value }) => (
      <BoxRow key={label}>
        <Column className="py-4 align-top text-[16px] leading-[22px] text-[#6a6a6a] dark:text-[#b0b0b0]">
          {label}
        </Column>
        <Column
          align="right"
          className="py-4 pl-4 text-right align-top text-[16px] leading-[22px] text-[#222222] dark:text-white"
        >
          {value}
        </Column>
      </BoxRow>
    ))}
  </>
);

/** A figure in the brand colour, like an order's total. */
export const BrandFigure = ({
  brand,
  children,
}: {
  brand: EmailBrand;
  children: ReactNode;
}) => (
  <span className="brand-text" style={{ color: brandColors(brand).text }}>
    {children}
  </span>
);

/** The primary action, in the brand colour; full width on a phone. */
export const EmailButton = ({
  brand,
  href,
  children,
}: {
  brand: EmailBrand;
  href: string;
  children: ReactNode;
}) => {
  const { color, onColor } = brandColors(brand);
  return (
    <Button
      href={href}
      className="brand-fill mobile:block mobile:w-full box-border rounded-[12px] px-7 py-[14px] text-center text-[17px] leading-[22px] font-semibold no-underline"
      style={{ backgroundColor: color, color: onColor }}
    >
      {children}
    </Button>
  );
};
