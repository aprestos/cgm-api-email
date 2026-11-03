import { describe, expect, it } from "vitest";

import { brandColors, contrast } from "./brand-colors";

describe("brandColors", () => {
  it("keeps a dark colour as it is, with white on it", () => {
    const colors = brandColors({ name: "Kijult", theme: { brandColor: "#1B2A52" } });

    expect(colors.color).toBe("#1B2A52");
    expect(colors.text).toBe("#1B2A52");
    expect(colors.onColor).toBe("#ffffff");
  });

  it("darkens a pale colour until it reads as text on white", () => {
    const colors = brandColors({ name: "Kijult", theme: { brandColor: "#F5C518" } });

    expect(colors.onColor).toBe("#222222");
    expect(contrast(colors.text, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("falls back to neutral ink, not congrem's colour, when there is none or it is not #rrggbb", () => {
    expect(brandColors({ name: "Kijult" }).color).toBe("#222222");
    expect(brandColors({ name: "Kijult", theme: { brandColor: "red" } }).color).toBe("#222222");
  });

  it("lightens a dark colour for the dark page", () => {
    const colors = brandColors({ name: "Kijult", theme: { brandColor: "#1B2A52" } });

    expect(contrast(colors.darkFill, "#161616")).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.darkText, "#161616")).toBeGreaterThanOrEqual(4.5);
  });

  it("turns the neutral fallback light in dark mode, not grey", () => {
    const colors = brandColors({ name: "Kijult" });

    expect(colors.darkFill).toBe("#e5e5e5");
    expect(colors.darkOnFill).toBe("#222222");
    expect(colors.darkText).toBe("#ffffff");
  });
});
