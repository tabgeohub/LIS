import { launchPdfBrowser } from "./launchPdfBrowser";
import { renderPdfPageFromHtml } from "./renderPdfPageFromHtml";

export async function renderHtmlToPdfBuffer(html: string): Promise<Buffer> {
  const browser = await launchPdfBrowser();
  try {
    return await renderPdfPageFromHtml(browser, html);
  } finally {
    await browser.close();
  }
}
