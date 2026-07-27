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

function firstString(
  ...values: Array<string | undefined | null>
): string {
  for (const value of values) {
    if (value) return value;
  }
  return "";
}

function toOptional(value: string): string | undefined {
  return value || undefined;
}

function readBodyField(options: {
  body: { error?: string; error_description?: string } | undefined;
  key: "error" | "error_description";
}): string | undefined {
  if (!options.body) return undefined;
  return options.body[options.key];
}

function readResponseBody(err: GrantErrorLike) {
  if (!err.response) return undefined;
  return err.response.body;
}

function readDirectGrantError(error: unknown) {
  const err = (error ?? {}) as GrantErrorLike;
  const body = readResponseBody(err);
  return {
    errorCode: firstString(err.error, readBodyField({ body, key: "error" })),
    errorDescription: firstString(
      err.error_description,
      readBodyField({ body, key: "error_description" }),
      err.message
    ),
    messageText: firstString(err.message),
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
  const errorCode = firstString(direct.errorCode, embedded.errorCode);
  const errorDescription = firstString(
    direct.errorDescription,
    embedded.errorDescription
  );

  return {
    error: toOptional(errorCode),
    error_description: toOptional(errorDescription),
    message: firstString(
      errorDescription,
      direct.messageText,
      "Unknown grant error"
    ),
  };
}
