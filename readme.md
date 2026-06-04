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

## License

MIT License
