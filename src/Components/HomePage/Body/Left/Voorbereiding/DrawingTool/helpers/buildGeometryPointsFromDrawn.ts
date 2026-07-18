import {
  toGeometryPointPayload,
  type GeometryPointContext,
} from "./toGeometryPointPayload";

export type DrawnShape = {
  type: string;
  points: number[][];
};

export type GeometryPointPayload = {
  omschrijving: string;
  regio_id: string | undefined;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  longitude: number;
  latitude: number;
  user_id: number | undefined;
  herhalen: number;
  organisatie: string;
  omschrijving_original: string;
  vertrouwelijk: number;
  activiteit: string;
  specifiekLettenOp: string;
  geometry_type: string;
};

export function buildGeometryPointsFromDrawn(input: GeometryPointContext & {
  graphicsDrawn: DrawnShape[];
}): GeometryPointPayload[] {
  const { graphicsDrawn, ...ctx } = input;
  const points: GeometryPointPayload[] = [];
  let pointOrder = 1;

  graphicsDrawn.forEach((shape) => {
    shape.points.forEach(([x, y]) => {
      const payload = toGeometryPointPayload({
        x,
        y,
        pointOrder,
        geometryType: shape.type,
        ctx,
      });
      if (!payload) return;
      points.push(payload);
      pointOrder++;
    });
  });

  return points;
}

export function resolveCombinedGeometryType(types: string[]): string {
  const unique = Array.from(new Set(types));
  if (unique.length === 1) return unique[0];
  return unique.join(", ");
}
