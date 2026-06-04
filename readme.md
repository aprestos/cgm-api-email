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

Common building blocks live in `emails/components`:

- `email-layout.tsx` for shared structure, header, and footer.
- `cta-button.tsx` for consistent primary actions.
- `info-row.tsx` for key-value metadata blocks.
- `order-items-table.tsx` for order lines.
- `qr-ticket-card.tsx` for QR-based ticket delivery.

## Example Emails

New examples built with the shared components:

- `emails/order-confirmation.tsx`
- `emails/payment-confirmation.tsx`
- `emails/ticket-delivery.tsx`
- `emails/team-invitation.tsx`

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
values: `ticket-delivery`, `order-confirmation`, `payment-confirmation`,
`team-invitation` (also listed at `GET /health`).

## License

MIT License
