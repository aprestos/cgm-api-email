import { Font } from "react-email";

const inter = (weight: 400 | 500 | 600, file: string) => (
  <Font
    fontFamily="Inter"
    fallbackFontFamily={["Arial", "sans-serif"]}
    webFont={{
      url: `https://fonts.gstatic.com/s/inter/v20/${file}.ttf`,
      format: "truetype",
    }}
    fontWeight={weight}
    fontStyle="normal"
  />
);

/**
 * Inter variable family (weights 100–900) via Google CSS `@import`.
 * Many webmail clients strip `@import`; the `<Font>` entries below register 400 / 500 / 600
 * static files as a fallback when the import does not run. Where neither loads
 * (Gmail, Outlook) the system font stack in the Tailwind config takes over.
 */
export function EmailFonts() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');`,
        }}
      />
      {inter(400, "UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg")}
      {inter(500, "UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg")}
      {inter(600, "UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg")}
    </>
  );
}
