import { Section, Text } from "react-email";

import { EmailLayout } from "../components/email-layout";
import { emailTheme, styles } from "../components/email-theme";
import { InfoRow } from "../components/info-row";
import { QrTicketCard } from "../components/qr-ticket-card";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import {DateTime} from "luxon";
import {getTicketTitle} from "../components/ticket.helper";

interface Ticket {
  ticket: {
    valid_from: string;
    valid_until: string;
  };
  recipient_name: string;
  recipient_email: string;
  code: string;
}

export interface TicketDeliveryEmailProps {
  tenant?: {
    contact?: string;
    socialNetworks?: {
      facebook?: string;
      instagram?: string;
      x?: string;
    };
    logoUrl?: string;
  };
  edition?: {
    name?: string;
    venue?: string;
    startsAt?: string;
  };
  customerName?: string;
  customer: {
    name?: string;
  };
  tickets?: Ticket[];
}

export const TicketDeliveryEmail = ({
  tenant = {
    contact: "info@congrem.io",
    socialNetworks: { facebook: "", instagram: "", x: "" },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
  },
  edition = {
    name: "Summer Music Festival",
    venue: "Central Park Stage",
    startsAt: "June 14, 2026 - 19:30",
  },
  customerName = "Alex Johnson",
  customer = {
    name: "Alex Johnson",
  },
  tickets = [
    {
      recipient_email: "alex.johnson@example.com",
      recipient_name: "Alex Johnson",
      code: "TCK-001-2026",
      ticket: {
        valid_from: "2026-07-13T19:30:00Z",
        valid_until: "2026-07-13T23:00:00Z",
      }
    },
    {
      recipient_email: "sam.rivera@example.com",
      recipient_name: "Sam Rivera",
      code: "TCK-002-2026",
      ticket: {
        valid_from: "2026-07-13T19:30:00Z",
        valid_until: "2026-07-13T23:00:00Z",
      }
    },
  ],
}: TicketDeliveryEmailProps) => (
  <EmailLayout
    preview={`Your tickets for ${edition.name}`}
    title="Your tickets are ready"
    subtitle={`Hi ${customer.name ?? customerName}, scan these QR codes at entry for quick access.`}
    brandName="congrem"
    brandLogoUrl={tenant.logoUrl}
    logoPlaceholderText="CE"
    heroIconUrl="https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/app/ticket.png"
    footerText="Please keep these tickets private. Each QR code is valid for one entry only."
    socialNetworks={tenant?.socialNetworks}
  >
    <Section style={styles.section}>
      <Text
        style={{
          margin: "0 0 10px",
          fontSize: "16px",
          lineHeight: "21px",
          color: emailTheme.colors.text,
        }}
      >
        <strong>{edition.name}</strong>
      </Text>
      {edition.venue ?<InfoRow
        icon={
          <IconMapPin
            size={20}
            color="#667382"
            style={{ verticalAlign: "middle" }}
          />
        }
        value={edition.venue}
      /> : null }

      {edition.startsAt ?<InfoRow
        icon={
          <IconCalendar
            size={20}
            color="#667382"
            style={{ verticalAlign: "middle" }}
          />
        }
        value={DateTime.fromISO(edition.startsAt).toFormat("dd/MM/yyyy - HH:mm")}
      />:null}
    </Section>

    <Section style={styles.section}>
      {tickets.map((ticket) => (
        <QrTicketCard
          key={ticket.code}
          attendeeName={ticket.recipient_name}
          title={getTicketTitle(ticket.ticket.valid_from, ticket.ticket.valid_until, "en-GB")}
          ticketCode={ticket.code}
        />
      ))}
      {/*<CtaButton href={manageTicketsUrl} label="Manage tickets" />*/}
    </Section>
  </EmailLayout>
);

TicketDeliveryEmail.PreviewProps = {
  tenant: {
    contact: "info@congrem.io",
    socialNetworks: {
      facebook: "https://facebook.com/example",
      instagram: "https://instagram.com/example",
      x: "https://x.com/example",
    },
    logoUrl:
      "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/tenants/be6adb88-d5c3-4786-89b2-e801c4f48d88/logos/ad3aa1de-e450-404d-a2ef-ea8feea308d6.png",
  },
  edition: {
    name: "Summer Music Festival",
    venue: "Central Park Stage",
    startsAt: "June 14, 2026 - 19:30",
  },
  customerName: "Alex Johnson",
  tickets: [
    {
      recipient_email: "alex.johnson@example.com",
      recipient_name: "Alex Johnson",
      code: "TCK-001-2026",
      ticket: {
        valid_from: "2026-07-13T19:30:00Z",
        valid_until: "2026-07-13T23:00:00Z",
      }
    },
    {
      recipient_email: "sam.rivera@example.com",
      recipient_name: "Sam Rivera",
      code: "TCK-002-2026",
      ticket: {
        valid_from: "2026-07-13T19:30:00Z",
        valid_until: "2026-07-13T23:00:00Z",
      }
    },
  ],
} as TicketDeliveryEmailProps;

export default TicketDeliveryEmail;
