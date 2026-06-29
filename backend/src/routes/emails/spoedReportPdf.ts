import puppeteer, { Page } from "puppeteer";

function isAllowedPuppeteerRequest(url: string): boolean {
  return (
    url.startsWith("data:") ||
    url === "about:blank" ||
    url.startsWith("about:srcdoc")
  );
}

async function blockExternalPuppeteerRequests(page: Page): Promise<void> {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (isAllowedPuppeteerRequest(request.url())) {
      request.continue();
      return;
    }
    request.abort();
  });
}

async function waitForEmbeddedAssets(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const d = (globalThis as any).document;
    const list = Array.from((d?.images ?? []) as any[]);
    await Promise.all(
      list.map((img: any) => {
        if (typeof img?.decode === "function")
          return img.decode().catch(() => {});
        if (img?.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
      })
    );
    const fontsReady = (d as any)?.fonts?.ready;
    if (fontsReady && typeof fontsReady.then === "function")
      await fontsReady;
  });
}

export async function renderHtmlToPdfBuffer(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      (puppeteer as { executablePath?: () => string }).executablePath?.(),
    dumpio: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
    ],
  });

  try {
    const page = await browser.newPage();
    await blockExternalPuppeteerRequests(page);
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });
    await page.emulateMediaType("screen");
    await waitForEmbeddedAssets(page);

    const bytes = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
    });
    return Buffer.from(bytes);
  } finally {
    await browser.close();
  }
}
