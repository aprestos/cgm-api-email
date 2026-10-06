/*
 * The model every email template renders from.
 *
 * Emails reach this service two ways, with different bodies:
 * - `POST /emails`, from cgm-api-supabase, for the emails in `emails/`;
 *   `server/templates.ts` maps its body to the model;
 * - `POST /hooks/send-email`, from Supabase Auth, for the emails in
 *   `emails/auth/`; `server/send-email-hook.ts` maps the hook's payload, and
 *   the user's metadata in it, to the model.
 *
 * A template only sees the model, so it does not care which way it came.
 */

export interface SocialNetworks {
  facebook?: string;
  instagram?: string;
  x?: string;
}

/** Whose branding an email carries: a tenant's, or congrem's own. */
export interface EmailBrand {
  /** Alt text of the logo, shown as text when there is no logo, and the copyright holder. */
  name: string;
  logoUrl?: string;
  /** Where the logo links to. */
  url?: string;
  /** Support address, shown in the footer. */
  contact?: string;
  socialNetworks?: SocialNetworks;
}

export interface EmailRecipient {
  name?: string;
  email?: string;
}

export interface EmailModel<Content> {
  brand: EmailBrand;
  recipient: EmailRecipient;
  /** What is particular to one email: the order, the tickets, the code… */
  content: Content;
}

export const congremBrand: EmailBrand = {
  name: "congrem",
  logoUrl:
    "https://nzktjtcukwbznnmdzlve.supabase.co/storage/v1/object/public/images/app/congrem-logo-green@2x.png",
  contact: "info@congrem.com",
};

/**
 * A tenant as both callers describe it: `data.tenant` in `/emails`, and
 * `tenant` in the user metadata the hook receives.
 */
export interface TenantData {
  name?: string;
  logoUrl?: string;
  url?: string;
  contact?: string;
  socialNetworks?: SocialNetworks;
}

/** The tenant's brand, or congrem's when there is no tenant. */
export function brandFromTenant(tenant?: TenantData): EmailBrand {
  if (!tenant) return congremBrand;
  return {
    name: tenant.name ?? congremBrand.name,
    logoUrl: tenant.logoUrl,
    url: tenant.url,
    contact: tenant.contact,
    socialNetworks: tenant.socialNetworks,
  };
}
