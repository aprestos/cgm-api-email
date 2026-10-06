import { Img, Section, Text } from "react-email";

interface QrTicketCardProps {
  attendeeName: string;
  title: string;
  ticketCode: string;
  className?: string;
}

const qrcodeSize: number = 300;

export const QrTicketCard = ({
  attendeeName,
  title,
  ticketCode,
  className = "",
}: QrTicketCardProps) => (
  <Section
    className={`mobile:px-4 rounded-[12px] border border-solid border-neutral-200 px-6 pt-5 pb-6 text-center dark:border-neutral-700 ${className}`}
  >
    <Text className="my-0 text-[16px] leading-[24px] font-semibold text-neutral-900 dark:text-white">
      {title}
    </Text>
    <Text className="my-0 text-[14px] leading-[20px] text-neutral-500 dark:text-neutral-400">
      {attendeeName}
    </Text>
    {/* White in dark mode too: a scanner needs light around the code. */}
    <Section className="mx-auto mt-4 max-w-[332px] rounded-[12px] bg-white p-4">
      <Img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrcodeSize}x${qrcodeSize}&margin=20&data=${ticketCode}`}
        alt={`QR code for ${ticketCode}`}
        width={qrcodeSize}
        height={qrcodeSize}
        // shrinks with the card on a phone narrower than the code
        className="mx-auto block h-auto max-w-full"
      />
    </Section>
  </Section>
);
