# React Email Starter

A live preview right in your browser so you don't need to keep sending real emails during development.

## Getting Started

First, install the dependencies:

```sh
npm install
# or
yarn
```

Then, run the development server:

```sh
npm run dev
# or
yarn dev
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

## Reusable Components

Common building blocks live in `components`:

- `email-layout.tsx`, the frame every email shares: one roomy column on a
  white page with the logo, a large title with a short bar of the brand
  colour under it, the content, and a footer with the social links. It adapts
  to phones (`mobile:`, up to 480px) and follows the reader's dark mode
  (`dark:`).
- `email-ui.tsx` for the content: `Paragraph`, `Strong`, `Box` (a rounded,
  outlined group) with `BoxTitle`, `BoxRow` and `DetailsList`, `BrandFigure`
  and `EmailButton`.
- `brand-colors.ts` derives the bar, button and text colours from the
  tenant's `theme.brandColor`, darkening a pale colour until text on white reads
  (and lightening it on the dark page). Without one, a tenant gets neutral
  ink; congrem's own emails use the green of its logo.
- `email-theme.ts` for the Tailwind config. The font is the system's; there
  is no web font, so every client shows the same type.
- `qr-ticket-card.tsx`, a ticket as a stub: who and when, a dashed tear line,
  and the QR code on white.

Gmail, Apple Mail and Outlook.com must render the emails without visible
degradation; Outlook for Windows gets a plain fallback (square corners).

Some apps lay their own CSS over an email (`img { height: auto }`, no
padding on tables), so the emails don't lean on inline CSS for sizes:

- The logo fits in 200×40 with both `width` and `height` set as attributes.
  `server/logo-size.ts` reads the logo's size from the image when an email
  renders (once per logo URL); if it can't, only the height is fixed.

The social icons are PNGs in public Supabase storage (`images/app/mail`):
Tabler icons, transparent, in `#737373` at 54px.

## Emails

Every template renders from one model, `EmailModel` in `models/email.ts`:
`brand` (the tenant's, or congrem's), `recipient` and `content`, the part that
is particular to one email. Emails come in two ways, each mapped to it:

- `emails/`: `order-confirmation`, `order-refunded` and `ticket-delivery`,
  sent by cgm-api-supabase through `POST /emails`. `server/templates.ts` maps
  its `data` (`tenant`, `customer`, and the order, refund or tickets).
- `emails/auth/`: `sign-in-code` and `password-reset`, the emails Supabase
  Auth asks for through its Send Email hook. The hook lives in
  cgm-api-supabase (`POST /emails/hook`): it loads the tenant by the
  `tenant_id` in the user's metadata and sends the email here straight away
  through `POST /emails`, not through its queue (`data`: `tenant`,
  `customer`, and `code` or `resetUrl`).

## Sending emails (API)

A small HTTP service renders any of the templates above and delivers it via
[Resend](https://resend.com).

1. Copy `.env.example` to `.env` and fill in `RESEND_API_KEY` and `RESEND_FROM`
   (the sender must use a domain verified in Resend). Optionally set
   `EMAIL_API_KEY` to require `Authorization: Bearer <key>` on requests.
2. Start the service:

   ```sh
   npm run start      # or: npm run start:dev  (watch mode)
   ```

3. Send an email. The template is selected with the `X-Email-Type` header; the
   JSON body carries the envelope and the template props under `data`:

   ```sh
   curl -X POST http://localhost:3001/emails \
     -H 'X-Email-Type: ticket-delivery' \
     -H 'content-type: application/json' \
     -d '{
       "to": "you@example.com",
       "data": { "customerName": "Alex", "edition": { "name": "Summer Fest" } }
     }'
   ```

Body fields: `to` (string or array, required), `from` (optional, defaults to
`RESEND_FROM`), `subject` (optional, each template provides a default),
`replyTo` (optional), and `data` (the template props). Valid `X-Email-Type`
values: `ticket-delivery`, `order-confirmation`, `order-refunded` (also listed
at `GET /health`).

## License

MIT License
