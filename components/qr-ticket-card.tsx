// @ts-nocheck
import { Img, Section, Text } from "react-email";

import { emailTheme } from "./email-theme.ts";

interface QrTicketCardProps {
  attendeeName: string;
  title: string;
  ticketCode: string;
}

const qrcodeSize: number = 300;

export const QrTicketCard = ({
  attendeeName,
  title,
  ticketCode,
}: QrTicketCardProps) => (
  <Section
    style={{
      border: `0px solid ${emailTheme.colors.border}`,
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      padding: "16px",
      marginTop: "12px",
      textAlign: "center",
    }}
  >
    <Text style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700 }}>
      {title}
    </Text>
    <Text
      style={{
        margin: "0 0 8px",
        fontSize: "14px",
        color: emailTheme.colors.text,
      }}
    >
      {attendeeName}
    </Text>
    <Img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrcodeSize}x${qrcodeSize}&margin=20&data=${ticketCode}`}
      alt={`QR code for ${ticketCode}`}
      width={qrcodeSize}
      height="300"
      style={{ margin: "0 auto", borderRadius: "8px" }}
    />
  </Section>
);
