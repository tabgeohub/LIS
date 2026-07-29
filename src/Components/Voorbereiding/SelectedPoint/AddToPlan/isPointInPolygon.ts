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
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
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

function isOutsideBoundingBox(input: {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}): boolean {
  return (
    input.x < input.minX ||
    input.x > input.maxX ||
    input.y < input.minY ||
    input.y > input.maxY
  );
}

export function isPointInPolygon(point: __esri.Point, ring: number[][]): boolean {
  const { x, y } = point;
  const box = ringBoundingBox(ring);

  if (isOutsideBoundingBox({ x, y, ...box })) {
    return false;
  }

  return pointInRingRayCast({ x, y, ring });
}
