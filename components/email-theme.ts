import { pixelBasedPreset, type TailwindConfig } from "react-email";
import plugin from "tailwindcss/plugin";

/*
 * Tailwind config every email renders with.
 *
 * The layout is written for a wide screen and narrowed with max-width
 * variants, not the other way round: the clients that drop <style> (and with
 * it every media query) are mostly desktop ones, so they get the wide layout,
 * which is the one that suits them.
 *
 * - `mobile:` up to 480px, phones, with tighter padding and smaller headings.
 * - `dark:` follows `prefers-color-scheme`.
 *
 * The font is the system's: San Francisco on Apple, Segoe UI on Windows,
 * Roboto on Android. No web font, so every client shows the same type.
 *
 * Colours come from Tailwind's palette and render as rgb(): neutral for the
 * backgrounds, text and borders. The brand colour is not here: it is the
 * tenant's, so it comes from `brand-colors.ts` as inline styles. Avoid opacity
 * modifiers like `bg-white/80`: they render as `rgb(… / 80%)`, which older
 * clients drop.
 */
export const emailTailwindConfig: TailwindConfig = {
  // rem → px; many clients size rem off something other than 16px
  presets: [pixelBasedPreset],
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("mobile", "@media (max-width: 480px)");
    }),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
};
