import { DateTime } from "luxon";

import { EmailLayout } from "../components/email-layout";
import { DetailsList, Panel, SectionTitle } from "../components/email-ui";
import { QrTicketCard } from "../components/qr-ticket-card";
import { getTicketTitle } from "../components/ticket.helper";
import type { EmailModel } from "../models/email";

export interface Ticket {
  ticket: {
    valid_from: string;
    valid_until: string;
  };
  recipient_name: string;
  recipient_email: string;
  code: string;
}

export interface TicketDeliveryContent {
  edition?: {
    name?: string;
    venue?: string;
    /** ISO date-time. */
    startsAt?: string;
  };
  tickets: Ticket[];
}

export const TicketDeliveryEmail = ({
  brand,
  recipient,
  content: { edition = {}, tickets },
}: EmailModel<TicketDeliveryContent>) => (
  <EmailLayout
    preview={`Your tickets for ${edition.name ?? "your event"}`}
    icon="ticket"
    eyebrow={edition.name}
    title="Your tickets are ready"
    subtitle={`${recipient.name ? `Hi ${recipient.name}, scan` : "Scan"} these QR codes at entry for quick access.`}
    brand={brand}
    footerText="Please keep these tickets private. Each QR code is valid for one entry only."
  >
    {edition.venue || edition.startsAt
      ? (
        <>
          <SectionTitle className="mb-3">Event</SectionTitle>
          <Panel className="mb-8">
            <DetailsList
              details={[
                ...(edition.venue ? [{ label: "Venue", value: edition.venue }] : []),
                ...(edition.startsAt
                  ? [{
                    label: "Date",
                    value: DateTime.fromISO(edition.startsAt).toFormat("dd/MM/yyyy - HH:mm"),
                  }]
                  : []),
              ]}
            />
          </Panel>
        </>
      )
      : null}

    <SectionTitle className="mb-3">
      {tickets.length === 1 ? "Your ticket" : `Your tickets (${tickets.length})`}
    </SectionTitle>
    {tickets.map((ticket, index) => (
      <QrTicketCard
        key={ticket.code}
        className={index < tickets.length - 1 ? "mb-4" : ""}
        attendeeName={ticket.recipient_name}
        title={getTicketTitle(ticket.ticket.valid_from, ticket.ticket.valid_until, "en-GB")}
        ticketCode={ticket.code}
      />
    ))}
  </EmailLayout>
);

TicketDeliveryEmail.PreviewProps = {
  brand: {
    name: "Kijult Weekend",
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
    contact: "info@congrem.com",
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
      x: "https://x.com/example",
    },
  },
  recipient: { name: "Alex Johnson", email: "alex.johnson@example.com" },
  content: {
    edition: {
      name: "Summer Music Festival",
      venue: "Central Park Stage",
      startsAt: "2026-07-13T19:30:00",
    },
    tickets: [
      {
        recipient_email: "alex.johnson@example.com",
        recipient_name: "Alex Johnson",
        code: "TCK-001-2026",
        ticket: {
          valid_from: "2026-07-13T19:30:00Z",
          valid_until: "2026-07-13T20:00:00Z",
        },
      },
      {
        recipient_email: "sam.rivera@example.com",
        recipient_name: "Sam Rivera",
        code: "TCK-002-2026",
        ticket: {
          valid_from: "2026-07-13T19:30:00Z",
          valid_until: "2026-07-13T20:00:00Z",
        },
      },
    ],
  },
} satisfies EmailModel<TicketDeliveryContent>;

export default TicketDeliveryEmail;
