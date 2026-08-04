export function isValidMapClickPoint(mapPoint?: __esri.Point | null) {
  return !!(
    mapPoint?.longitude &&
    mapPoint?.latitude &&
    Number.isFinite(mapPoint.longitude) &&
    Number.isFinite(mapPoint.latitude)
  );
}
