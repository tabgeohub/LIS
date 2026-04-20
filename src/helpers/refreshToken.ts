import esriId from "@arcgis/core/identity/IdentityManager";
import { getBackEndUrl } from "./getBackEndUrl";

export async function refreshToken() {
  async function fetchAndRegisterToken() {
    const response = await fetch(`${getBackEndUrl()}/api/arcgis/token`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(message || `Failed to fetch ArcGIS token (${response.status})`);
    }

    const data = await response.json();
    const token = String(data?.access_token || "");
    const serverUrl = String(data?.server || "");

    if (!token || !serverUrl) {
      throw new Error("Invalid ArcGIS token response from backend");
    }

    const credential = {
      token,
      server: serverUrl,
    };

    localStorage.setItem("credential_token", token);
    localStorage.setItem("credential_server", serverUrl);
    esriId.registerToken(credential);
  }

  await fetchAndRegisterToken();

  setInterval(fetchAndRegisterToken, 5 * 60 * 1000);
}
