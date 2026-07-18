import type { Page } from "puppeteer";

function isAllowedPuppeteerRequest(url: string): boolean {
  return (
    url.startsWith("data:") ||
    url === "about:blank" ||
    url.startsWith("about:srcdoc")
  );
}

export async function blockExternalPuppeteerRequests(page: Page): Promise<void> {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (isAllowedPuppeteerRequest(request.url())) {
      request.continue();
      return;
    }
    request.abort();
  });
}
