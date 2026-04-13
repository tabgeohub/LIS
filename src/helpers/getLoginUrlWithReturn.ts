import { getBackEndUrl } from "./getBackEndUrl";

/** Keycloak login via backend `/auth/login`, returning to the given path after callback. */
export function getKeycloakLoginUrlWithReturn(returnPathWithQuery: string): string {
  const path = returnPathWithQuery.startsWith("/")
    ? returnPathWithQuery
    : `/${returnPathWithQuery}`;
  const params = new URLSearchParams({
    return_to: path,
  });
  return `${getBackEndUrl()}/auth/login?${params.toString()}`;
}
