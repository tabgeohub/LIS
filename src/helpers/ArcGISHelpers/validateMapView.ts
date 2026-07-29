/**
 * Validates that mapView and required graphics layers exist
 * @param mapView - The map view to validate
 * @param layers - Optional graphics layers to validate
 * @returns true if all parameters are valid, false otherwise
 */
export function validateMapView(
  mapView: any,
  ...layers: any[]
): boolean {
  if (!mapView) return false;
  return layers.every((layer) => layer !== null && layer !== undefined);
}

