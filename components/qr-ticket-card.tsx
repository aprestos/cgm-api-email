import { Column, Img, Row, Section, Text } from "react-email";

import { fullWidth, line } from "./email-ui";

// the code itself about 190px: the rest is the quiet zone in the image
const qrcodeSize: number = 256;

/**
 * A ticket as a stub: who and when on top, then under a dashed tear line the
 * QR code on white, in dark mode too, because a scanner needs light around
 * the code.
 */
export const QrTicketCard = ({
  position,
  count,
  attendeeName,
  title,
  validity,
  ticketCode,
  displayId,
  className,
}: {
  /** 1-based, of `count` tickets in the email. */
  position: number;
  count: number;
  attendeeName: string;
  title: string;
  /** The days it admits, like "13 Jun, 14 Jun". */
  validity?: string;
  /** What the QR code encodes. */
  ticketCode: string;
  /** The ticket number printed under the code. */
  displayId: string;
  className?: string;
}) => (
  <Row className={fullWidth}>
    <Column className={className}>
      <Section className={`${line} ${fullWidth} rounded-[16px] border`}>
        <Row className={fullWidth}>
          <Column className="mobile:px-4 px-6 pt-5 pb-4">
            <Row className={fullWidth}>
              <Column className="align-top text-[20px] leading-[26px] font-bold text-[#222222] dark:text-white">
                {attendeeName}
              </Column>
              <Column
                align="right"
                className="w-[72px] text-right align-top text-[14px] leading-[26px] text-[#6a6a6a] dark:text-[#b0b0b0]"
              >
                {position} of {count}
              </Column>
            </Row>
            <Text className="m-0 text-[16px] leading-[24px] text-[#222222] dark:text-[#e5e5e5]">
              {[title, validity].filter(Boolean).join(" · ")}
            </Text>
          </Column>
        </Row>
        <Row className={fullWidth}>
          <Column
            align="center"
            className="mobile:px-4 rounded-b-[16px] bg-white px-6 py-3 text-center"
            // inline, not `border-dashed`: react-email resolves Tailwind's
            // border-style variable once per email, which would dash every line
            style={{ borderTop: "1px dashed #dddddd" }}
          >
            <Img
              // the quiet zone is in the image (`margin`), so the code keeps its
              // light surround where a client darkens the white background
              src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrcodeSize * 2}x${qrcodeSize * 2}&margin=32&data=${encodeURIComponent(ticketCode)}`}
              alt={`QR code for ticket ${displayId}`}
              width={qrcodeSize}
              height={qrcodeSize}
              // shrinks with the stub on a phone narrower than the code
              className="mx-auto block h-auto max-w-full"
            />
            <Text className="m-0 mb-2 text-[14px] leading-[20px] text-[#6a6a6a]">
              {displayId}
            </Text>
          </Column>
        </Row>
      </Section>
    </Column>
  </Row>
);
