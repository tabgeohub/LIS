import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import {
  configureArcgisProxy,
  fetchArcgisToken,
  registerArcgisToken,
} from "./arcgisTokenRegistration";

/** Refresh ArcGIS proxy + credential token from the backend. */
export async function refreshArcgisToken() {
  const backendUrl = getBackEndUrl();
  configureArcgisProxy(`${backendUrl}/api/arcgis/proxy`);
  registerArcgisToken(await fetchArcgisToken(`${backendUrl}/api/arcgis/token`));
}
