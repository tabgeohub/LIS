import { ensureUndiciCorporateProxy } from "../helpers/http/outboundHttpProxy";
import { cacheAdminToken, getCachedAdminToken } from "./keycloakAdminTokenCache";
import { createKeycloakAdminContext } from "./keycloakAdminTokenContext";
import {
  getAdminTokenTimeoutMs,
  requestAdminTokenWithRetry,
} from "./keycloakAdminTokenRequest";
import { parseKeycloakAdminTokenResponse } from "./parseKeycloakAdminTokenResponse";

export async function getKeycloakAdminToken(req: any): Promise<string> {
  ensureUndiciCorporateProxy();
  const context = createKeycloakAdminContext(req);
  const cached = getCachedAdminToken({ profile: context.profile });
  if (cached) return cached;

  const response = await requestAdminTokenWithRetry({
    tokenUrl: context.tokenUrl,
    tokenParams: context.tokenParams,
    timeoutMs: getAdminTokenTimeoutMs(),
  });
  const result = await parseKeycloakAdminTokenResponse(response);
  cacheAdminToken({ profile: context.profile, ...result });
  return result.token;
}

export function getKeycloakAdminBase(req: any): string {
  return createKeycloakAdminContext(req).baseUrl;
}
