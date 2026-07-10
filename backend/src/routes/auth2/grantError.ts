export type GrantErrorDetails = {
  error?: string;
  error_description?: string;
  message: string;
};

function tryParseJsonObject(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function extractGrantError(error: unknown): GrantErrorDetails {
  const err = error as {
    error?: string;
    error_description?: string;
    message?: string;
    response?: { body?: { error?: string; error_description?: string } };
  };

  let errorCode = err?.error || err?.response?.body?.error;
  let errorDescription =
    err?.error_description ||
    err?.response?.body?.error_description ||
    err?.message ||
    "";

  const messageText = String(err?.message || "");
  const embeddedJson = messageText.match(/\{[\s\S]*\}/)?.[0];

  const candidates = [messageText, embeddedJson].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const parsed = tryParseJsonObject(candidate);
    if (!parsed) continue;

    errorCode = errorCode || String(parsed.error || "");
    errorDescription =
      errorDescription || String(parsed.error_description || "");
  }

  return {
    error: errorCode || undefined,
    error_description: errorDescription || undefined,
    message: String(errorDescription || messageText || "Unknown grant error"),
  };
}
