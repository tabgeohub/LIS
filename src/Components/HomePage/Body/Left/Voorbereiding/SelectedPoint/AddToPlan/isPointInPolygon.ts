export function ringBoundingBox(ring: number[][]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const [px, py] of ring) {
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }

  return { minX, maxX, minY, maxY };
}

export function pointInRingRayCast(input: {
  x: number;
  y: number;
  ring: number[][];
}): boolean {
  let inside = false;
  for (let i = 0, j = input.ring.length - 1; i < input.ring.length; j = i++) {
    const xi = input.ring[i][0];
    const yi = input.ring[i][1];
    const xj = input.ring[j][0];
    const yj = input.ring[j][1];

    const intersect =
      yi > input.y !== yj > input.y &&
      input.x < ((xj - xi) * (input.y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

export function isPointInPolygon(point: __esri.Point, ring: number[][]): boolean {
  const { x, y } = point;
  const { minX, maxX, minY, maxY } = ringBoundingBox(ring);

  if (x < minX || x > maxX || y < minY || y > maxY) {
    return false;
  }

  return pointInRingRayCast({ x, y, ring });
}
