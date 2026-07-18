import type { Browser, Page } from "puppeteer";
import { blockExternalPuppeteerRequests } from "./blockExternalPuppeteerRequests";
import { waitForEmbeddedAssets } from "./waitForEmbeddedAssets";

export async function renderPdfPageFromHtml(
  browser: Browser,
  html: string
): Promise<Buffer> {
  const page = await browser.newPage();
  await blockExternalPuppeteerRequests(page);
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.emulateMediaType("screen");
  await waitForEmbeddedAssets(page);
  const bytes = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
  });
  return Buffer.from(bytes);
}
