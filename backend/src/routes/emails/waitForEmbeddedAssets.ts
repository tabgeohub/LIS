import type { Page } from "puppeteer";

export async function waitForEmbeddedAssets(page: Page): Promise<void> {
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
    if (fontsReady && typeof fontsReady.then === "function") await fontsReady;
  });
}
