import type { EmailBrand } from "../models/email";

/*
 * The colours an email derives from its brand colour. A tenant can pick any
 * colour, a pale yellow as well as a navy, so the text colours are worked out
 * for contrast instead of assumed.
 *
 * They are inline styles, not Tailwind classes: Tailwind only knows the
 * colours it was compiled with. Their dark-mode values go in `brandCss`.
 */

const ink = "#222222";
/** The page in dark mode (`dark:bg-[#161616]` in `email-layout.tsx`). */
export const darkPage = "#161616";

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

/** `amount` of `other` mixed into `hex`. */
const mix = (hex: string, other: string, amount: number) => {
  const a = channels(hex);
  const b = channels(other);
  return toHex(a.map((c, i) => c + (b[i] - c) * amount));
};

const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export function brandColors(brand: EmailBrand) {
  // without a colour of its own, a tenant gets neutral ink, not congrem's;
  // in dark mode that ink turns light, rather than a grey that looks disabled
  const brandColor = brand.theme?.brandColor;
  const neutral = !/^#[0-9a-f]{6}$/i.test(brandColor ?? "");
  const color = neutral ? ink : brandColor!;

  // the brand colour as text on white, darkened until it is readable
  let text = color;
  for (let amount = 0.1; contrast(text, "#ffffff") < 4.5; amount += 0.1) {
    text = mix(color, ink, amount);
  }

  // and as text on the dark page, lightened until it is readable
  let darkText = neutral ? "#ffffff" : color;
  for (let amount = 0.1; contrast(darkText, darkPage) < 4.5; amount += 0.1) {
    darkText = mix(color, "#ffffff", amount);
  }

  // the bar and the button on the dark page: the colour itself when it
  // stands out from the page, else the lightened one
  const darkFill = neutral ? "#e5e5e5" : contrast(color, darkPage) >= 3 ? color : darkText;

  return {
    /** The bar under the title and the button. */
    color,
    /** Text on `color`. */
    onColor: contrast(color, "#ffffff") >= contrast(color, ink) ? "#ffffff" : ink,
    /** The brand colour as text on white: a total, links. */
    text,
    /** `text` on the dark page. */
    darkText,
    /** `color` and `onColor` on the dark page. */
    darkFill,
    darkOnFill: contrast(darkFill, "#ffffff") >= contrast(darkFill, ink) ? "#ffffff" : ink,
  };
}

/**
 * The dark-mode brand colours, for the email's <head>: an inline style can
 * not change with the colour scheme, so the elements with the `brand-text`
 * or `brand-fill` class get theirs from here.
 */
export function brandCss(brand: EmailBrand) {
  const { darkText, darkFill, darkOnFill } = brandColors(brand);
  return `
  @media (prefers-color-scheme: dark) {
    .brand-text { color: ${darkText} !important; }
    .brand-fill { background-color: ${darkFill} !important; color: ${darkOnFill} !important; }
  }
`;
}
