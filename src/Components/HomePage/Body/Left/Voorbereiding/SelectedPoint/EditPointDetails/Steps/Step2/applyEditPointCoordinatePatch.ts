import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import type { SpatialReference } from "Types";

export type EditPointCoordinateValues = {
  coordinateSystem: SpatialReference;
  x: number;
  y: number;
  longitude: number;
  latitude: number;
};

/** Returns form values after applying an RD/WGS sync patch (logging stays in the caller). */
export function nextValuesAfterCoordinatePatch<T extends EditPointCoordinateValues>(
  values: T,
  patch: CoordinateSyncPatch
): T {
  if (values.coordinateSystem === "RD") {
    return {
      ...values,
      longitude: patch.longitude ?? values.longitude,
      latitude: patch.latitude ?? values.latitude,
    };
  }

  if (values.coordinateSystem === "WGS84") {
    return {
      ...values,
      x: patch.rdX ?? values.x,
      y: patch.rdY ?? values.y,
    };
  }

  return values;
}

export function coordinateSystemChangeLogMessage(
  coordinateSystem: SpatialReference
): string | null {
  if (coordinateSystem === "RD") {
    return "User changed the coordinate system to RD";
  }
  if (coordinateSystem === "WGS84") {
    return "User changed the coordinate system to WGS84";
  }
  return null;
}
