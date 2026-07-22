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

type GrantErrorLike = {
  error?: string;
  error_description?: string;
  message?: string;
  response?: { body?: { error?: string; error_description?: string } };
};

function readDirectGrantError(error: unknown) {
  const err = error as GrantErrorLike;
  const messageText = String(err?.message || "");
  const body = err?.response?.body;
  return {
    errorCode: err?.error || body?.error || "",
    errorDescription:
      err?.error_description || body?.error_description || err?.message || "",
    messageText,
  };
}

function firstParsedGrantError(candidates: string[]) {
  for (const candidate of candidates) {
    const parsed = tryParseJsonObject(candidate);
    if (parsed) {
      return {
        errorCode: String(parsed.error || ""),
        errorDescription: String(parsed.error_description || ""),
      };
    }
  }
  return { errorCode: "", errorDescription: "" };
}

function readEmbeddedGrantError(messageText: string) {
  const embeddedJson = messageText.match(/\{[\s\S]*\}/)?.[0];
  const candidates = [messageText, embeddedJson].filter(Boolean) as string[];
  return firstParsedGrantError(candidates);
}

export function extractGrantError(error: unknown): GrantErrorDetails {
  const direct = readDirectGrantError(error);
  const embedded = readEmbeddedGrantError(direct.messageText);
  const errorCode = direct.errorCode || embedded.errorCode;
  const errorDescription =
    direct.errorDescription || embedded.errorDescription;

  return {
    error: errorCode || undefined,
    error_description: errorDescription || undefined,
    message: String(
      errorDescription || direct.messageText || "Unknown grant error"
    ),
  };
}
