import {
  createSelectionGeometryGraphic,
  type ClickableGeometry,
} from "./createGeometryMapGraphics";

export function buildSelectedGeometryGraphics(
  geometries: ClickableGeometry[],
  selectedGeometryIds: number[]
): __esri.Graphic[] {
  return selectedGeometryIds.flatMap((geometryId) => {
    const geometry = geometries.find((item) => item.id === geometryId);
    if (!geometry?.points?.length) return [];

    const graphic = createSelectionGeometryGraphic(geometry, geometry);
    return graphic ? [graphic] : [];
  });
}
