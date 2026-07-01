export function buildErrorPayload(err: any, requestId: string) {
  const sg = err?.response?.body?.errors;
  return {
    message: String(err?.message || err),
    code: err?.code,
    errno: err?.errno,
    address: err?.address,
    port: err?.port,
    providerStatus: err?.response?.statusCode,
    providerErrors: Array.isArray(sg) ? sg : undefined,
    requestId,
  };
}
