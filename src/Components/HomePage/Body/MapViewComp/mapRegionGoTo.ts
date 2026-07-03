import { regionsCoordinates } from "@constants/regionCoordintaes";

const DEFAULT_MAP_CENTER = { longitude: 4.9041, latitude: 52.3676, zoom: 8 };

export function resolveUserRegionGoTo(role: string) {
  const currentRegion = regionsCoordinates.find(
    (region) => region.role === role.split(" ")[1]
  );

  if (currentRegion) {
    return { target: currentRegion.center, zoom: currentRegion.zoom };
  }

  return {
    target: [DEFAULT_MAP_CENTER.longitude, DEFAULT_MAP_CENTER.latitude],
    zoom: DEFAULT_MAP_CENTER.zoom,
  };
}
