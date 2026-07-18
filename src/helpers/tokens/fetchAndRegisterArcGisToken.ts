import esriId from "@arcgis/core/identity/IdentityManager";

function registerTokenForServers(token: string, servers: string[]): void {
  const normalized = Array.from(
    new Set(servers.map((s) => s.replace(/\/+$/, "")))
  );
  normalized.forEach((server) => {
    esriId.registerToken({ server, token });
  });
}

export async function fetchAndRegisterArcGisToken(
  tokenEndpoint: string,
  servers: string[]
): Promise<boolean> {
  const res = await fetch(tokenEndpoint, { credentials: "include" });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("credential_token");
    localStorage.removeItem("credential_server");
    return false;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch token: ${res.status} ${text}`);
  }

  const { access_token } = (await res.json()) as {
    access_token: string;
    expires_at?: number;
  };

  if (!access_token) {
    throw new Error("No access_token in token response");
  }

  registerTokenForServers(access_token, servers);
  localStorage.setItem("credential_token", access_token);
  localStorage.setItem("credential_server", servers[0]);
  return true;
}
