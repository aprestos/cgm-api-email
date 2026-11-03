---
version: 1
slug: "components-email-layout-tsx"
primary_target: "components/email-layout.tsx"
related_targets: ["components/email-ui.tsx"]
---

# Transactional emails (EmailLayout)

Scope: the shared frame every Congrem email renders in, and its content blocks. Mode: operate. Readers: convention-goers, mostly on phones, finding the one thing the email is for.

## Direction contract

THESIS: Simple and modern, lightly distinguishable: a friendly, roomy single column in the manner of Airbnb and Booking emails. Refuses themed costume (the rejected game card) and the grey-page boxed receipt.

OWN-WORLD: White page (near-black #161616 in dark), one 580px column, the system font, a 32px bold title with a short 48×4 bar of the tenant colour under it, 17px body, rounded 16px outlined boxes with a bold box title and hairline rows, the tenant colour on the bar, the button and the one figure that matters (a total, a refund).

STORY: The reader sees whose convention it is (logo, colour bar), what the email is (title), then reads a short note and finds the details grouped in one box, or the code, or the button.

FIRST VIEWPORT: Logo, title with the colour bar, greeting and the one-paragraph note, then the box (order summary, refund details, event) or the code box or the button. Tickets follow as rounded stubs: ticket n of m, attendee, validity, a dashed tear line, the QR on white and its code.

FORM: user-pinned: option C ("Airbnb / Booking") of four reference styles the user asked to compare (Stripe, Linear/Vercel, Airbnb/Booking, Apple). seed: none (user-pinned; no roll this round)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Constraints: Gmail, Apple Mail and Outlook.com without visible degradation; Outlook desktop a clean fallback. Tables only, no flex or grid, no web fonts. Tenant colour may be any hex: text colours are derived for contrast.
