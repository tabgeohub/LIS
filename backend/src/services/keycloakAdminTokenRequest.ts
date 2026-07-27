import { fetch, Response } from "undici";

export function getAdminTokenTimeoutMs(): number {
  const parsed = parseInt(
    process.env.KEYCLOAK_ADMIN_TOKEN_TIMEOUT_MS || "15000",
    10
  );
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000;
}

function logAdminTokenFetchFailure(input: {
  attempt: number;
  tokenUrl: string;
  error: any;
}): void {
  const { attempt, tokenUrl, error } = input;
  console.error(
    `[getKeycloakAdminToken] Fetch failed (attempt ${attempt}/2):`,
    {
      error: error?.message || String(error),
      code: error?.code || "UNKNOWN",
      endpoint: tokenUrl,
      cause: error?.cause,
    }
  );
}

function throwAdminTokenConnectionError(lastError: unknown): never {
  const error = lastError as any;
  throw new Error(
    `Failed to connect to Keycloak token endpoint: ${error?.message || String(error)} (${error?.code || "UNKNOWN"})`
  );
}

async function postAdminTokenOnce(input: {
  tokenUrl: string;
  tokenParams: URLSearchParams;
  timeoutMs: number;
  fetchImpl?: typeof fetch;
}): Promise<Response> {
  return (input.fetchImpl ?? fetch)(input.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: input.tokenParams,
    signal: AbortSignal.timeout(input.timeoutMs),
  });
}

export async function requestAdminTokenWithRetry(input: {
  tokenUrl: string;
  tokenParams: URLSearchParams;
  timeoutMs: number;
  fetchImpl?: typeof fetch;
}): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await postAdminTokenOnce(input);
    } catch (error: any) {
      lastError = error;
      logAdminTokenFetchFailure({ attempt, tokenUrl: input.tokenUrl, error });
    }
  }
  throwAdminTokenConnectionError(lastError);
}
