import { DateTime } from "luxon";
import { Text } from "react-email";

import { EmailLayout } from "../components/email-layout";
import { Box, BoxTitle, Greeting, Paragraph } from "../components/email-ui";
import { QrTicketCard } from "../components/qr-ticket-card";
import { getTicketTitle } from "../components/ticket.helper";
import type { EmailModel } from "../models/email";

export interface Ticket {
  ticket: {
    /** The ticket type's name, like "Weekend pass". */
    name?: string;
    /** The days it admits, as ISO dates ("2026-06-13"). */
    days?: string[];
    valid_from: string;
    valid_until: string;
  };
  attendee_name: string;
  attendee_email: string;
  /** What the QR code encodes; never shown as text. */
  code: string;
  /** The ticket number people see, like "2E8D4B07". */
  displayId?: string;
}

export interface TicketDeliveryContent {
  edition?: {
    name?: string;
    venue?: string;
    /** ISO date-time. */
    startsAt?: string;
    /** ISO date-time. */
    endsAt?: string;
  };
  tickets: Ticket[];
}

/**
 * The days a ticket admits: "13 Jun, 14 Jun" from its `days`; without them,
 * from its validity, "13 Jun" or "13 – 14 Jun".
 */
const validDays = ({ ticket }: Ticket) => {
  if (ticket.days?.length) {
    return [...ticket.days]
      .sort()
      .map((day) => DateTime.fromISO(day, { zone: "utc" }).setLocale("en-GB"))
      .filter((day) => day.isValid)
      // non-breaking spaces, so a narrow screen wraps between days, not inside one
      .map((day) => day.toFormat("d LLL").replaceAll(" ", "\u00a0"))
      .join(", ");
  }

  const from = DateTime.fromISO(ticket.valid_from, { zone: "utc" }).setLocale("en-GB");
  const until = DateTime.fromISO(ticket.valid_until, { zone: "utc" }).setLocale("en-GB");
  if (!from.isValid) return undefined;
  return !until.isValid || from.hasSame(until, "day")
    ? from.toFormat("d LLL")
    : `${from.toFormat("d")} – ${until.toFormat("d LLL")}`;
};

/**
 * When the edition runs: "13 Jun 2026", or with an end on a later day
 * "13 – 14 Jun 2026", "30 May – 1 Jun 2026".
 */
const editionDates = ({ startsAt, endsAt }: NonNullable<TicketDeliveryContent["edition"]>) => {
  const start = DateTime.fromISO(startsAt ?? "").setLocale("en-GB");
  const end = DateTime.fromISO(endsAt ?? "").setLocale("en-GB");
  if (!start.isValid) return undefined;
  if (!end.isValid || end <= start || start.hasSame(end, "day")) {
    return start.toFormat("d LLL yyyy");
  }
  const from = start.hasSame(end, "month")
    ? "d"
    : start.hasSame(end, "year") ? "d LLL" : "d LLL yyyy";
  return `${start.toFormat(from)} – ${end.toFormat("d LLL yyyy")}`;
};

export const TicketDeliveryEmail = ({
  brand,
  recipient,
  content: { edition = {}, tickets },
}: EmailModel<TicketDeliveryContent>) => {
  const dates = editionDates(edition);

  return (
    <EmailLayout
      preview={`Your tickets for ${edition.name ?? "your event"} are here`}
      title="Your tickets are here"
      brand={brand}
      footerText="Keep your tickets private: each QR code can be used for one entry only."
    >
      <Greeting name={recipient.name} />
      <Paragraph>Show the QR code at the entrance and you&apos;re in.</Paragraph>

      {edition.name || dates || edition.venue
        ? (
          <Box className="mt-8 pb-5">
            <BoxTitle>{edition.name ?? "Your event"}</BoxTitle>
            {dates
              ? (
                <Text className="m-0 text-[16px] leading-[24px] text-[#222222] dark:text-[#e5e5e5]">
                  {dates}
                </Text>
              )
              : null}
            {edition.venue
              ? (
                <Text className="m-0 text-[16px] leading-[24px] text-[#6a6a6a] dark:text-[#b0b0b0]">
                  {edition.venue}
                </Text>
              )
              : null}
          </Box>
        )
        : null}

      {tickets.map((ticket, index) => (
        <QrTicketCard
          key={ticket.code}
          className="mt-4"
          position={index + 1}
          count={tickets.length}
          attendeeName={ticket.attendee_name}
          title={ticket.ticket.name ??
            getTicketTitle(ticket.ticket.valid_from, ticket.ticket.valid_until, "en-GB")}
          validity={validDays(ticket)}
          ticketCode={ticket.code}
          // until every sender has `displayId`, the code itself
          displayId={ticket.displayId ?? ""}
        />
      ))}
    </EmailLayout>
  );
};

TicketDeliveryEmail.PreviewProps = {
  brand: {
    name: "Kijult Weekend",
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
    contact: "info@congrem.com",
    // synthetic, for the preview: no tenant has a colour yet
    theme: { brandColor: "#D7263D" },
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
      x: "https://x.com/example",
    },
  },
  recipient: { name: "Alex Johnson", email: "alex.johnson@example.com" },
  content: {
    edition: {
      name: "Kijult Weekend 2026",
      venue: "Lisbon Congress Centre",
      startsAt: "2026-06-13T10:00:00",
      endsAt: "2026-06-14T20:00:00",
    },
    tickets: [
      {
        attendee_email: "alex.johnson@example.com",
        attendee_name: "Alex Johnson",
        code: "c1d0e7a2-5f3b-4e8a-9b6c-2d4f8a1e7c30",
        displayId: "8A1E7C30",
        ticket: {
          name: "Weekend pass",
          days: ["2026-06-13", "2026-06-14"],
          valid_from: "2026-06-13T10:00:00Z",
          valid_until: "2026-06-14T20:00:00Z",
        },
      },
      {
        attendee_email: "sam.rivera@example.com",
        attendee_name: "Sam Rivera",
        code: "8b2e4f19-0a7c-4d3e-b5f1-6c9a2e8d4b07",
        displayId: "2E8D4B07",
        ticket: {
          name: "Saturday pass",
          days: ["2026-06-13"],
          valid_from: "2026-06-13T10:00:00Z",
          valid_until: "2026-06-13T20:00:00Z",
        },
      },
    ],
  },
} satisfies EmailModel<TicketDeliveryContent>;

export default TicketDeliveryEmail;
