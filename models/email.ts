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

/** How a brand looks. */
export interface Theme {
  /** `#rrggbb`: the bar under the title, the button, the key figure. */
  brandColor?: string;
}

/** Whose branding an email carries: a tenant's, or congrem's own. */
export interface EmailBrand {
  /** Alt text of the logo, shown as text when there is no logo, and the copyright holder. */
  name: string;
  logoUrl?: string;
  /** The logo's size in pixels, read from the image when the email renders (`server/logo-size.ts`). */
  logoSize?: { width: number; height: number };
  /** Where the logo links to. */
  url?: string;
  /** Support address, shown in the footer. */
  contact?: string;
  theme?: Theme;
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
  logoSize: { width: 480, height: 126 },
  contact: "info@congrem.com",
  // the green of the logo, so congrem's emails carry one colour
  theme: { brandColor: "#1F7A5C" },
};

/** A tenant as cgm-api-supabase describes it: `data.tenant` in `/emails`. */
export interface TenantData {
  name?: string;
  logoUrl?: string;
  url?: string;
  contact?: string;
  theme?: Theme;
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
    theme: tenant.theme,
    socialNetworks: tenant.socialNetworks,
  };
}
