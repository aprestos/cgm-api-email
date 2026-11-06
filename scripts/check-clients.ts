/*
 * Screenshots every email the way the clients that most often break it would
 * show it, for a person to look through: `npm run check:clients`, then open
 * `.client-check/index.html`. Pass email types to check only those:
 * `npm run check:clients -- ticket-delivery`.
 *
 * Two engines: WebKit is Apple Mail, iOS Mail and most Mac and iPhone apps;
 * Chromium is the Gmail app on Android and most webmail. Each email renders
 * from its preview props:
 *
 * - as sent, on a phone (light and dark) and on a desktop;
 * - with `app-css`, what an app that lays its own CSS over an email does:
 *   it drops table widths and table padding and margins, and sizes images
 *   with `height: auto`;
 * - with `no-style`, a client that drops <style>: no media queries, so no
 *   phone or dark layout.
 *
 * It only fails on what a script can tell: a page wider than the screen.
 * It is no substitute for real clients (Litmus, Email on Acid) or for sending
 * yourself the email.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { ComponentType } from "react";
import { chromium, webkit } from "playwright";

import type { EmailModel } from "../models/email";
import { renderEmail } from "../server/render";
import { emailTypes, templates } from "../server/templates";

// npm runs scripts from the package root
const outDir = join(process.cwd(), ".client-check");

const appCss = (html: string) =>
  html
    .replace(/ width="100%"/g, "")
    .replace(/<table[^>]*>/g, (table) => table.replace(/(?<![-\w])width:100%;?/g, ""))
    .replace(
      "</head>",
      "<style>img { max-width: 100% !important; height: auto !important; }" +
        " table { padding: 0 !important; margin: 0 !important; }</style></head>",
    );

const noStyle = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, "");

const shots = [
  { name: "phone", width: 390, colorScheme: "light", variant: (html: string) => html },
  { name: "phone-dark", width: 390, colorScheme: "dark", variant: (html: string) => html },
  { name: "desktop", width: 800, colorScheme: "light", variant: (html: string) => html },
  { name: "app-css", width: 390, colorScheme: "light", variant: appCss },
  { name: "app-css-dark", width: 390, colorScheme: "dark", variant: appCss },
  { name: "no-style", width: 390, colorScheme: "light", variant: noStyle },
] as const;

const engines = { webkit, chromium };

// tsx runs this as CommonJS, which has no top-level await
async function main() {
  const only = process.argv.slice(2);
  const types = only.length > 0 ? emailTypes.filter((type) => only.includes(type)) : emailTypes;
  if (types.length === 0) {
    console.error(`No email type matches ${only.join(", ")}. Types: ${emailTypes.join(", ")}.`);
    process.exit(1);
  }

  const htmlByType = new Map<string, string>();
  for (const type of types) {
    // every template has preview props, for `npm run dev`
    const { Component } = templates[type] as unknown as {
      Component: ComponentType<EmailModel<unknown>> & { PreviewProps: EmailModel<unknown> };
    };
    htmlByType.set(type, (await renderEmail(Component, Component.PreviewProps)).html);
  }

  rmSync(outDir, { recursive: true, force: true });
  const results: { type: string; engine: string; shot: string; file: string; overflow: number }[] = [];

  for (const [engine, browserType] of Object.entries(engines)) {
    const browser = await browserType.launch();
    for (const { name, width, colorScheme, variant } of shots) {
      const context = await browser.newContext({ viewport: { width, height: 800 }, colorScheme });
      for (const [type, html] of htmlByType) {
        const page = await context.newPage();
        await page.setContent(variant(html), { waitUntil: "networkidle", timeout: 20_000 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        const file = `${type}/${engine}-${name}.png`;
        mkdirSync(join(outDir, type), { recursive: true });
        await page.screenshot({ path: join(outDir, file), fullPage: true });
        results.push({ type, engine, shot: name, file, overflow });
        await page.close();
      }
      await context.close();
    }
    await browser.close();
  }

  // a contact sheet: per email, a row of shots per engine
  const figure = ({ shot, file, overflow }: (typeof results)[number]) =>
    `<figure><img src="${file}" width="${shot === "desktop" ? 400 : 390}" loading="lazy">` +
    `<figcaption>${shot}${overflow > 0 ? ` <b>overflows by ${overflow}px</b>` : ""}</figcaption></figure>`;
  const sections = [...htmlByType.keys()].map((type) =>
    `<h2>${type}</h2>` +
    Object.keys(engines).map((engine) =>
      `<h3>${engine}</h3><div class="row">${
        results.filter((r) => r.type === type && r.engine === engine).map(figure).join("")
      }</div>`
    ).join("")
  );
  writeFileSync(
    join(outDir, "index.html"),
    `<!doctype html><meta charset="utf-8"><title>Email client check</title>
  <style>
    body { font: 14px system-ui, sans-serif; margin: 24px; background: #eee; }
    .row { display: flex; gap: 16px; align-items: flex-start; overflow-x: auto; padding-bottom: 8px; }
    figure { margin: 0; }
    img { display: block; border: 1px solid #ccc; }
    b { color: #c00; }
  </style>
  <h1>Email client check</h1>
  <p>app-css: table widths, padding and margins dropped, images at <code>height: auto</code>.
  no-style: &lt;style&gt; dropped, so no phone or dark layout.</p>
  ${sections.join("\n")}`,
  );

  const overflowing = results.filter((r) => r.overflow > 0);
  for (const { type, engine, shot, overflow } of overflowing) {
    console.error(`✗ ${type}: ${engine} ${shot} is ${overflow}px wider than the screen`);
  }
  console.log(
    `${results.length} screenshots: ${pathToFileURL(join(outDir, "index.html"))}`,
  );
  if (overflowing.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
