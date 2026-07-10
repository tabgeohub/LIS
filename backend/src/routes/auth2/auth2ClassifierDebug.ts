/**
 * Temporary OTP login failure classifier diagnostics.
 * Enable with AUTH2_DEBUG_CLASSIFIER=true — do not log credentials or tokens.
 */
export function isAuth2ClassifierDebugEnabled(): boolean {
  return process.env.AUTH2_DEBUG_CLASSIFIER?.trim().toLowerCase() === "true";
}

export function logAuth2ClassifierDebug(
  event: string,
  meta: Record<string, unknown>
): void {
  if (!isAuth2ClassifierDebugEnabled()) {
    return;
  }

  console.warn(
    JSON.stringify({
      type: "auth2.classifier_debug",
      event,
      ...meta,
      ts: new Date().toISOString(),
    })
  );
}
