---
name: Congrem transactional emails
description: Simple and modern, lightly distinguishable; a roomy white column that carries the convention's colour in three places only.
colors:
  brand-congrem: "#1F7A5C"
  brand-neutral-fallback: "#222222"
  on-brand-ink: "#222222"
  page: "#ffffff"
  page-dark: "#161616"
  text-strong: "#222222"
  text-body-dark: "#e5e5e5"
  text-muted: "#6a6a6a"
  text-muted-dark: "#b0b0b0"
  hairline: "#dddddd"
  hairline-dark: "#3a3a3a"
  code-well: "#f7f7f7"
  code-well-dark: "#262626"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "-0.01em"
  headline-mobile:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: "32px"
    letterSpacing: "-0.01em"
  code:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "48px"
    letterSpacing: "0.25em"
  figure:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "26px"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "26px"
  row:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "22px"
  body-muted:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  button:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
rounded:
  bar: "2px"
  button: "12px"
  box: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "48px"
  column: "580px"
components:
  button-primary:
    backgroundColor: "{colors.brand-congrem}"
    textColor: "{colors.page}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "14px 28px"
  brand-bar:
    backgroundColor: "{colors.brand-congrem}"
    rounded: "{rounded.bar}"
    width: "48px"
    height: "4px"
  box:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.box}"
    padding: "0 24px"
  box-mobile:
    rounded: "{rounded.box}"
    padding: "0 20px"
  box-title:
    textColor: "{colors.text-strong}"
    typography: "{typography.title}"
    padding: "20px 0 12px"
  detail-row:
    textColor: "{colors.text-strong}"
    typography: "{typography.row}"
    padding: "16px 0"
  code-well:
    backgroundColor: "{colors.code-well}"
    textColor: "{colors.text-strong}"
    typography: "{typography.code}"
    rounded: "{rounded.box}"
    padding: "24px 0"
  ticket-stub-qr:
    backgroundColor: "{colors.page}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    padding: "12px 24px"
---

# Design System: Congrem transactional emails

## Overview

**Creative North Star: "The Front Desk Note"**

Every email is a short, friendly note handed across a well-run front desk: whose convention it is, what happened, and the one thing you need, in that order. The system is user-pinned as "simple and modern, lightly distinguishable", in the manner of Airbnb and Booking emails: a white page, one roomy 580px column, the reader's own system font, generous air, and outlined rounded boxes that group the facts. It is light in density and quiet in tone; nothing on the page is decoration.

"Lightly distinguishable" is carried by the tenant's colour and nothing else. It appears in three places: the 48×4 bar under the title, the primary button, and the one figure that matters (an order total, a refund amount, a fallback link). Everything else is neutral ink on white, or white on near-black in dark mode, so any tenant colour, from navy to pale yellow, sits in the same frame without fighting it.

The system replaces a rejected themed "game card" world (a framed card from the convention's deck, dark banner, grey page, Archivo display type). That costume, and the grey-page boxed receipt, are confirmed rejections.

**Key Characteristics:**
- White page, near-black (#161616) in dark mode; one 580px column, no card on a grey page.
- System font stack only; bold 32px title over a short brand-colour bar.
- 16px-radius outlined boxes with a bold box title and hairline rows.
- The tenant colour on the bar, the button and one figure; derived for contrast, never assumed.
- Tickets as light stubs: who and when, a dashed tear line, the QR on white.
- Tables only; degrades to a clean, wide, readable layout where `<style>` is dropped.

## Colors

A neutral grey ramp on white, with exactly one chromatic voice: the tenant's brand colour, derived per email.

### Primary
- **Tenant Brand Colour** (per tenant, `theme.brandColor`): the bar under the title, the primary button, the key figure and the fallback link. It is never a fixed hex; `brand-colors.ts` derives every use from it (see The Derived Voice Rule).
- **Congrem Logo Green** (`brand-congrem`): Congrem's own colour, used only when the email goes out under Congrem's brand (auth emails without a tenant). It is the example value in the frontmatter's component tokens, not the default for tenants.
- **Neutral Ink Fallback** (`brand-neutral-fallback`): what a tenant without a `theme.brandColor` gets. The bar, button and figure turn ink, not Congrem green.
- **On-Brand Ink** (`on-brand-ink`): the dark text set on a pale brand fill (a yellow button) when it out-contrasts white.

### Neutral
- **Page White** (`page`): the page, the box interiors and the QR stub, which stays white in dark mode.
- **Night Page** (`page-dark`): the dark-mode page. Set in `<head>` on `body`, not on `<Body>`.
- **Strong Ink** (`text-strong`): titles, box titles, row values, emphasis. White in dark mode.
- **Body Ink Dark** (`text-body-dark`): body paragraphs in dark mode.
- **Quiet Grey** (`text-muted` / `text-muted-dark`): muted paragraphs, labels, box-title detail, ticket position, footer.
- **Hairline** (`hairline` / `hairline-dark`): box outlines, row dividers, the footer rule, the ticket tear line.
- **Code Well** (`code-well` / `code-well-dark`): the filled, unoutlined tray behind a sign-in code.

### Named Rules
**The Derived Voice Rule.** The brand colour is input, not output. `brandColors(brand)` returns `color` (bar, button fill), `onColor` (white or on-brand ink, whichever contrasts more), `text` (the colour darkened toward ink in 10% steps until it reaches 4.5:1 on white), `darkText` (lightened toward white until 4.5:1 on the night page), `darkFill` (`color` if it reaches 3:1 on the night page, else `darkText`) and `darkOnFill`. Examples from the build: #1F7A5C keeps itself everywhere with white on fill and lightens to #4c957d as dark text; pale yellow #F5C400 takes ink on fill and darkens to #866e0f as text on white; the ink fallback turns light in dark mode: #e5e5e5 fill with ink text, white figures. Never pick a text or fill colour by eye.

**The Head-Borne Dark Rule.** Brand colours are inline styles (Tailwind only knows colours it was compiled with), and an inline style cannot follow the colour scheme. Dark-mode brand values ship once in `<head>` through `brandCss(brand)`: any element carrying the brand colour as text gets the `brand-text` class; any element filled with it (bar, button) gets `brand-fill`.

**The Three Places Rule.** The tenant colour appears on the title bar, the primary button and at most one figure or link per email. Neutrals carry everything else.

## Typography

**Display Font:** System UI (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif)
**Body Font:** the same stack

**Character:** San Francisco on Apple, Segoe UI on Windows, Roboto on Android: the reader's own interface face, so every client renders the same intended type and nothing waits on a font download. Hierarchy comes from size and weight alone.

### Hierarchy
- **Headline** (700, 32px/38px, -0.01em; 26px/32px at 480px and below): the email's title, one per email, directly over the brand bar.
- **Code** (700, 40px/48px, 0.25em tracking with a matching text-indent to re-centre; 32px/40px on phone): the sign-in code only.
- **Figure** (700, 22px/28px): the order total, in the brand text colour.
- **Title** (700, 20px/26px): box titles, the attendee name on a ticket stub, and the text logo when a brand has no logo image.
- **Body** (400, 17px/26px): the note. Strong ink in light, #e5e5e5 in dark; emphasis is bold in strong ink or white.
- **Row** (400, 16px/22px): detail rows and line items (labels muted, values strong), event date and venue, ticket validity.
- **Body Muted** (400, 15px/24px): what comes after the point of the email: security notes, "you can safely ignore this".
- **Label** (400, 14px/20px; 22px line in the footer): box-title detail, item category, ticket "n of m", ticket code, footer.
- **Button** (600, 17px/22px).

### Named Rules
**The No Web Font Rule.** The system stack only. No `@font-face`, no Google Fonts link; a face that only some clients load makes a different email in each.

**The Size-and-Weight Rule.** Hierarchy is size and bold. No uppercase tracked labels, no italics, no second family.

## Layout

One column, `max-width: 580px`, centred on a full-width page section, padded 48px top and bottom and 32px at the sides; at 480px and below the padding tightens to 32px and 24px. The order is fixed: logo (40px tall, at most 200px wide, linked to the brand URL), title 40px below (32px on phone), the bar 16px under the title, content 32px under the bar, then a hairline-topped footer 48px below the content with 32px inside it (social icons 18px PNGs, then two 14px muted lines).

Content rhythm runs on a 4px base with 16, 24 and 32px as the working steps: 16px between the greeting and the note and between stacked ticket stubs, 24px around a button or code well, 32px before a box. Blocks in `email-ui.tsx` never set their own outer margin; the template spaces them through `className`, because two Tailwind classes for the same property do not override in a predictable order.

Responsive behaviour is written wide-first and narrowed with `mobile:` (max-width 480px): clients that drop `<style>` are mostly desktop ones and keep the wide layout. On a phone the button goes full width, box padding drops to 20px, and the QR shrinks with its stub.

**The Tables Only Rule.** Structure is React Email's `Section`, `Row` and `Column` (tables). No flex, no grid, no absolutely positioned layers.

## Elevation & Depth

Flat. There are no shadows anywhere in the build. Depth is conveyed by a 1px hairline outline around a box, hairline rows inside it, and in two places a change of surface: the grey code well behind a sign-in code, and the white QR stub, which stays white on the night page so the ticket reads as paper in dark mode.

### Named Rules
**The Hairline Rule.** Grouping is an outline at 1px in the hairline colour, never a shadow, a tinted card or a grey page behind a white card.

## Shapes

Soft, consistent rounding. Boxes, ticket stubs and the code well round at 16px; the button at 12px; the brand bar at 2px. The ticket stub's white lower half rounds only its bottom corners to sit inside the outline. The one non-solid line is the ticket's tear: a 1px dashed hairline set as an inline `border-top`.

**The Inline Dash Rule.** Dashed lines are written inline (`border-top: 1px dashed`), never with Tailwind's `border-dashed`: react-email resolves Tailwind's border-style variable once per email, so one `border-dashed` dashes every border in it.

## Components

### Buttons
Calm and full: a solid, rounded block of the tenant colour.
- **Shape:** gently rounded (12px).
- **Primary:** brand `color` fill with `onColor` text, 14px × 28px padding, semibold 17px, no underline, centred text. Carries `brand-fill` so dark mode swaps in `darkFill` / `darkOnFill`. Full width at 480px and below.
- **Hover / Focus:** none; email clients do not reliably render interactive states.
- **Secondary:** none. A fallback for a link the button carries is a muted 14px line plus the URL as a brand-text link (`break-all`, no underline) under a hairline.

### Cards / Containers (Box)
- **Corner Style:** 16px.
- **Background:** none (the page shows through).
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px hairline.
- **Internal Padding:** 24px at the sides (20px on phone). A **box title** (bold 20px, optional 14px muted detail line 4px under it) sits in 20px top / 12px bottom padding; each **row** below it starts with a hairline and pads 16px vertically (20px for the total row). Detail rows put a muted label left and a strong value right-aligned.

### Brand Bar
The system's one signature: a 48×4 bar, 2px rounded, in the brand `color`, left-aligned 16px under the title. It is a table cell with `font-size: 0; line-height: 0` and a non-breaking space so every client keeps its height, and it carries `brand-fill`.

### Code Well
A 16px-rounded tray in the code-well grey, 24px vertical padding, centred, holding the sign-in code in the Code style. No outline; the fill alone sets it apart.

### Ticket Stub
A box holding one ticket. Upper part: attendee name (Title) with "n of m" right-aligned in a 72px muted column, then the ticket title and validity as one Row-size line joined with " · ". Then a 1px dashed hairline tear (inline), and a white lower part, white in dark mode too, with the QR code centred at 220px (rendered at 440px, shrinking on narrow phones) and its code in 14px muted grey under it. The quiet zone lives inside the PNG (`margin=32`) so the code keeps its light surround even where a client darkens the white background.

### Footer
Hairline rule, optional social icons (18px PNGs from public storage, with alt text), the contact line and the copyright, both 14px muted.

## Do's and Don'ts

### Do:
- **Do** derive every brand use through `brandColors(brand)` and mark it `brand-text` or `brand-fill` so dark mode follows.
- **Do** keep the tenant colour to the bar, the button and one figure or link.
- **Do** group facts in one 16px-rounded hairline box with a bold 20px title and hairline rows.
- **Do** keep the QR on white with its quiet zone inside the image, in every mode.
- **Do** write dashed lines as inline styles.
- **Do** check every email at 480px and in dark mode; the wide layout is the no-`<style>` fallback.

### Don't:
- **Don't** hard-code a tenant's colour or fall back to Congrem green for a tenant; a tenant without a colour gets neutral ink.
- **Don't** load a web font or add a second family.
- **Don't** use flex, grid, shadows, or opacity colour modifiers (`bg-white/80` renders as `rgb(… / 80%)`, which older clients drop).
- **Don't** use Tailwind's `border-dashed`.
- **Don't** return to the themed game card: no framed deck card, dark banner, or grey page behind a white card.
- **Don't** add uppercase tracked labels or kickers above the title; the logo and the bar already say whose email it is.
