import { refreshToken } from "@helpers/refreshToken";

export async function fetchWithRetry(input: {
  url: string;
  options?: RequestInit;
  maxRetries?: number;
}): Promise<Response> {
  const { url, options = {}, maxRetries = 2 } = input;
  let lastErr: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 401 || res.status === 498) {
        try {
          await refreshToken();
        } catch {}
        lastErr = new Error(`Auth ${res.status}`);
      } else if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
      } else {
        return res;
      }
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
  }
  throw lastErr;
}

export async function runWithConcurrency<T>(input: {
  tasks: (() => Promise<T>)[];
  concurrency: number;
}): Promise<T[]> {
  const results: T[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < input.tasks.length) {
      const current = nextIndex++;
      results[current] = await input.tasks[current]();
    }
  }

  const workers = Array.from(
    { length: Math.max(1, input.concurrency) },
    worker
  );
  await Promise.all(workers);
  return results;
}

export async function preloadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${window.location.origin}/logo.png`);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
