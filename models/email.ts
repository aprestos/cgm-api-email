/*
 * The model every email template renders from.
 *
 * Emails reach this service through `POST /emails`, from cgm-api-supabase;
 * `server/templates.ts` maps its body to the model. A template only sees the
 * model, not the body it came from.
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

/** A tenant as cgm-api-supabase describes it: `data.tenant` in `/emails`. */
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
