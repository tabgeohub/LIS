import esriId from "@arcgis/core/identity/IdentityManager";

export async function refreshToken() {
  const token_endpoint = String(import.meta.env.VITE_ARCGIS_TOKEN_ENDPOINT);
  const client_id = String(import.meta.env.VITE_ARCGIS_CLIENT_ID);
  const client_secret = String(import.meta.env.VITE_ARCGIS_CLIENT_SECRET);
  const serverUrl = String(import.meta.env.VITE_ARCGIS_SERVER_URL);

  async function fetchAndRegisterToken() {
    const response = await fetch(token_endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id,
        client_secret,
      }),
    });

    const data = await response.json();
    const token = data.access_token;

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
