import { refreshToken } from "@helpers/refreshToken";

const AUTH_RETRY_STATUSES = new Set([401, 498]);

async function refreshAuthIfNeeded(status: number): Promise<void> {
  if (!AUTH_RETRY_STATUSES.has(status)) return;
  try {
    await refreshToken();
  } catch {
    // ignore refresh failures; caller will retry or throw
  }
}

function classifyFetchAttempt(res: Response): Error | null {
  if (AUTH_RETRY_STATUSES.has(res.status)) {
    return new Error(`Auth ${res.status}`);
  }
  if (!res.ok) {
    return new Error(`HTTP ${res.status}`);
  }
  return null;
}

async function delayBeforeRetry(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
}

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
      const attemptError = classifyFetchAttempt(res);
      if (!attemptError) return res;
      await refreshAuthIfNeeded(res.status);
      lastErr = attemptError;
    } catch (e) {
      lastErr = e;
    }
    await delayBeforeRetry();
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
