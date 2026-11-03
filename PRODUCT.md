# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People going to a board game convention run on Congrem: they bought a ticket, are about to, or are signing in to a convention's site. They read these emails on a phone more often than not, sometimes at the venue door. Each email has one job for them: confirm the order went through, hand over the tickets, give them a sign-in code or a reset link, or confirm a refund.

## Product Purpose

cgm-api-email renders and sends Congrem's transactional emails (order confirmation, refund, ticket delivery, sign-in code, password reset) for every tenant, a convention organiser. Success: the reader finds the one thing the email is for at once, trusts that it comes from the convention they bought from, and it looks right in the clients they actually use.

## Positioning

The emails go out under the convention's brand, not Congrem's. Congrem's own brand is the fallback when there is no tenant.

## Operating Context

- Sent by cgm-api-supabase through `POST /emails`, and by the Supabase Auth Send Email hook.
- Clients that must render without visible degradation: Gmail (web and apps), Apple Mail / iOS Mail, Outlook.com / new Outlook. Others, Outlook desktop on Windows included, get a clean, readable fallback.
- Read in light and dark mode, at phone width (480px and below) and on desktop.
- Tickets are scanned from the email at the entrance.

## Capabilities and Constraints

- Email HTML: React Email components and tables; no flex or grid for structure; absolute HTTPS images with alt text; icons as PNGs in public Supabase storage (`images/app/mail`).
- Brand data per tenant: name, logo (`logos.long`), url, contact email, social networks. A tenant accent colour (`theme.brandColor` on `data.tenant`) is wanted but does not exist in the database yet; until it does, a tenant's emails use neutral ink.
- Personal data and codes (OTP codes, reset links, QR payloads) never go to logs.
- The QR code needs a light surround in every mode to stay scannable.

## Brand Commitments

- The tenant's name, logo and (when present) colour lead; a tenant's name or colour is never hard-coded.
- Congrem's brand (green logo, `info@congrem.com`) only as the fallback.
- Simple and modern first, lightly distinguishable (the owner's brief, November 2026; an earlier themed "game card" direction was rejected as too much for anything but tickets).
- Tickets keep a light ticket stub: who and when, a tear line, the QR code.

## Evidence on Hand

- Real copy in the existing templates (`emails/`, `emails/auth/`); preview data is synthetic.
- No tenant colours or event imagery exist in the data yet; do not fabricate them in production code.

## Product Principles

1. The one thing the email is for is visible first: the code, the tickets, the order total.
2. The convention's brand, not Congrem's.
3. Works in the clients people use, degrades cleanly elsewhere.
4. Never leaks personal data or codes.
