import { imageSize } from "image-size";

import type { EmailBrand } from "../models/email";

// a logo's URL changes with each upload, so a size read once stays right
const sizes = new Map<string, { width: number; height: number }>();

/**
 * The brand with its logo's size, read from the image itself, so the layout
 * can give the logo a fixed width and height. Without it (the image can't be
 * fetched or read) the brand comes back as it was, and the layout sizes the
 * logo by its height alone.
 */
export async function withLogoSize(brand: EmailBrand): Promise<EmailBrand> {
  const { logoUrl } = brand;
  if (!logoUrl || brand.logoSize) return brand;

  let size = sizes.get(logoUrl);
  if (!size) {
    try {
      const res = await fetch(logoUrl, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { width, height } = imageSize(new Uint8Array(await res.arrayBuffer()));
      size = { width, height };
      sizes.set(logoUrl, size);
    } catch (err) {
      console.warn(`[logo] could not read the size of ${logoUrl}:`, err);
      return brand;
    }
  }
  return { ...brand, logoSize: size };
}
