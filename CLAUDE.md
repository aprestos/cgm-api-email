# cgm-api-email

Renders Congrem's transactional emails with React Email and sends them through Resend, behind a small Hono server on Node. `readme.md` describes the templates, the components and the HTTP API; read it before changing either.

## Commands

- `npm run dev`: React Email preview at http://localhost:3000. Check every template here, in light and dark, at phone width.
- `npm run start:dev`: the API on :3001 (`POST /emails`, `GET /health`). Env vars are in `.env.example`.
- `npm test`: Vitest (`server/templates.test.ts`, `components/*.test.ts`).
- `npm run typecheck`: `tsc --noEmit`. Run it before calling a change done.

## Shape

- `models/email.ts`: `EmailModel`, which every template renders from:
  - `brand`: the tenant's, or Congrem's as the fallback
  - `recipient`
  - `content`: the part specific to one email
- `server/templates.ts` maps the `X-Email-Type` header and the request's `data` to a template, and owns the list of valid types.
- `emails/*.tsx` are order and ticket emails. `emails/auth/*.tsx` are the emails for the Supabase Auth Send Email hook.
- `components/` holds `email-layout.tsx` (the shared frame), `email-ui.tsx` (content blocks), `email-theme.ts` (Tailwind config), `qr-ticket-card.tsx`, and helpers.

## Rules

- **Callers live in cgm-api-supabase.** They are `_shared/emails/email-server.ts`, the `emails` function and the `emails/hook` function. A change to a type name, a `data` field or a response is a contract change: update both sides, and list the API change if you are not making it.
- **A new email** needs all of these:
  - a template in `emails/` built from `EmailLayout` and `email-ui` blocks
  - a mapping and type in `server/templates.ts`
  - a test in `server/templates.test.ts`
  - a preview with realistic props
  - the sender in cgm-api-supabase
- **Email clients are not browsers.** Use the React Email components and the layout's Tailwind config, and no flex or grid for structure. Images are absolute HTTPS URLs (the icons live in public Supabase storage under `images/app/mail`). Every image has alt text. Keep layouts working at 480px (`mobile:`) and in dark mode (`dark:`).
- **Branding comes from the tenant.** Never hard-code a tenant's name or colour, and keep Congrem's own brand only as the fallback.
- **Personal data and codes** (OTP codes, reset links, QR payloads) never go to logs.
- **Auth.** When `EMAIL_API_KEY` is set, `POST /emails` requires `Authorization: Bearer <key>`. Do not weaken that path.

`/review-pr [number]` reviews with the `email-reviewer` agent.
