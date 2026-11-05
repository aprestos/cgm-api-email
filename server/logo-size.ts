
import type { EmailBrand } from "../models/email";

// a logo's URL changes with each upload, so a size read once stays right
const sizes = new Map<string, { width: number; height: number }>();

/**
 * The brand with its logo's size, read from the image itself, so the layout
 * can give the logo a fixed width and height. Without it (the image can't be
 * fetched or read) the brand comes back as it was, and the layout sizes the
 * logo by its height alone.
 */
export async function withLogoSize(brand: EmailBrand, height: number): Promise<EmailBrand> {
  const { logoUrl } = brand;
  if (!logoUrl || height) return brand;
//TODO apply resize
  return brand;
}

