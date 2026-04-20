let arcgisToken: string | null = null;
let arcgisServer: string | null = null;

export function setArcGISToken(token: string, server: string): void {
  arcgisToken = token || null;
  arcgisServer = server || null;
}

export function getArcGISToken(): string | null {
  return arcgisToken;
}

export function getArcGISServer(): string | null {
  return arcgisServer;
}

