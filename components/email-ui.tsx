import { Button, Column, Row, Section, Text } from "react-email";
import type { ReactNode } from "react";

/*
 * Building blocks for the content of an `EmailLayout`. None of them sets an
 * outer margin; the email spaces them with `className`. Two classes for the
 * same property (say `mb-0` and `mb-4`) do not override each other in a
 * predictable order, so a block never sets what its caller would.
 */

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const Paragraph = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Text
    className={cx(
      "my-0 text-[15px] leading-[24px] text-neutral-600 dark:text-neutral-300",
      className,
    )}
  >
    {children}
  </Text>
);

/** Emphasis inside a `Paragraph`. */
export const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-neutral-900 dark:text-white">
    {children}
  </strong>
);

/** Small uppercase label over a group, like "Order summary". */
export const SectionTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Text
    className={cx(
      "my-0 text-[12px] leading-[18px] font-semibold tracking-[0.06em] text-neutral-500 uppercase dark:text-neutral-400",
      className,
    )}
  >
    {children}
  </Text>
);

/** A tinted, rounded box that groups related content. */
export const Panel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Section
    className={cx(
      "mobile:px-4 rounded-[12px] border border-solid border-neutral-200 bg-neutral-50 px-5 py-1 dark:border-neutral-700 dark:bg-neutral-800",
      className,
    )}
  >
    {children}
  </Section>
);

const divider =
  "border-0 border-t border-solid border-neutral-200 dark:border-neutral-700";

export interface Detail {
  label: string;
  value: ReactNode;
}

/** Label / value rows with a line between them, typically inside a `Panel`. */
export const DetailsList = ({ details }: { details: Detail[] }) => (
  <>
    {details.map(({ label, value }, index) => (
      <Row key={label} className={index > 0 ? divider : undefined}>
        <Column className="py-3 align-top text-[14px] leading-[20px] text-neutral-500 dark:text-neutral-400">
          {label}
        </Column>
        <Column
          align="right"
          className="py-3 pl-4 text-right align-top text-[14px] leading-[20px] font-medium text-neutral-900 dark:text-white"
        >
          {value}
        </Column>
      </Row>
    ))}
  </>
);

/** A row in a list, with the line above it from the second row on. */
export const ListRow = ({
  first,
  children,
}: {
  first: boolean;
  children: ReactNode;
}) => <Row className={first ? undefined : divider}>{children}</Row>;

/** The primary action; full width on a phone, where it is easier to tap. */
export const EmailButton = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Button
    href={href}
    className="mobile:block mobile:w-full box-border rounded-[10px] bg-indigo-600 px-6 py-3 text-center text-[15px] leading-[24px] font-semibold text-white no-underline dark:bg-indigo-500"
  >
    {children}
  </Button>
);
