import type { Polygon } from "geojson";

export function getBboxPolygon(coords: [number, number][]): Polygon {
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);

  const minX = Math.min(...lons);
  const maxX = Math.max(...lons);
  const minY = Math.min(...lats);
  const maxY = Math.max(...lats);

  return {
    type: "Polygon",
    coordinates: [
      [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY],
        [minX, minY],
      ],
    ],
  };
}
