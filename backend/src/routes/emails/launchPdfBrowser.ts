import puppeteer, { Browser } from "puppeteer";

export async function launchPdfBrowser(): Promise<Browser> {
  return puppeteer.launch({
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
}
