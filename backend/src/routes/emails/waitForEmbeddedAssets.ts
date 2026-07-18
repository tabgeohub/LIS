import type { Page } from "puppeteer";

export async function waitForEmbeddedAssets(page: Page): Promise<void> {
  await page.evaluate(async () => {
    async function waitForImage(img: any): Promise<void> {
      if (typeof img?.decode === "function") {
        await img.decode().catch(() => {});
        return;
      }
      if (img?.complete) return;

      await new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
    }

    async function waitForFonts(documentLike: any): Promise<void> {
      const fontsReady = documentLike?.fonts?.ready;
      if (fontsReady && typeof fontsReady.then === "function") {
        await fontsReady;
      }
    }

    const d = (globalThis as any).document;
    const list = Array.from((d?.images ?? []) as any[]);
    await Promise.all(list.map((img: any) => waitForImage(img)));
    await waitForFonts(d);
  });
}
