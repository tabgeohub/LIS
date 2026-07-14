import { getBackEndUrl } from "./getBackEndUrl";
import {
  configureArcgisProxy,
  fetchArcgisToken,
  registerArcgisToken,
} from "./arcgisTokenRegistration";

export async function refreshToken() {
  const backendUrl = getBackEndUrl();
  configureArcgisProxy(`${backendUrl}/api/arcgis/proxy`);
  registerArcgisToken(await fetchArcgisToken(`${backendUrl}/api/arcgis/token`));
}
