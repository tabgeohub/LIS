export function parseKeycloakIssuer(issuerUrl: string): {
  serverUrl: string;
  realm: string;
} {
  const urlParts = issuerUrl.split("/realms/");
  return { serverUrl: urlParts[0], realm: urlParts[1] };
}
