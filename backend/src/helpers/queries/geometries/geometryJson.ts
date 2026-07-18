import { GEOMETRY_POINT_CORE_KEYS } from "../points/pointCoreColumns";

export type GeometryPointsJsonPreset = "coords" | "full";

const GEOMETRY_POINT_COORDS_KEYS = [
  "id",
  "longitude",
  "latitude",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
] as const;

const GEOMETRY_POINT_FULL_KEYS = [
  "id",
  ...GEOMETRY_POINT_CORE_KEYS,
  "geometry_id",
  "status",
  "created_at",
] as const;

type GeometryPointCoordsKey = (typeof GEOMETRY_POINT_COORDS_KEYS)[number];
type GeometryPointFullKey = (typeof GEOMETRY_POINT_FULL_KEYS)[number];

function geometryPointPair(
  key: GeometryPointCoordsKey | GeometryPointFullKey,
  pointAlias: string
): string {
  return `'${key}', ${pointAlias}.${key}`;
}

export function buildGeometryPointsJsonObject(
  preset: GeometryPointsJsonPreset,
  pointAlias = "p"
): string {
  const keys =
    preset === "coords" ? GEOMETRY_POINT_COORDS_KEYS : GEOMETRY_POINT_FULL_KEYS;
  const fields = keys.map((key) => geometryPointPair(key, pointAlias));

  return `JSON_BUILD_OBJECT(
              ${fields.join(",\n              ")}
            )`;
}

export function buildGeometryPointsJsonAgg(
  preset: GeometryPointsJsonPreset,
  pointAlias = "p"
): string {
  return `JSON_AGG(
            ${buildGeometryPointsJsonObject(preset, pointAlias)}
            ORDER BY ${pointAlias}.id ASC
          )`;
}

export function buildGeometrySelectFields(pointsAggregate: string): string {
  return `g.id,
          g.omschrijving,
          g.organisatie,
          g.vertrouwelijk,
          g.herhalen,
          g.activiteit,
          g.specifiek_letten_op,
          g.type,
          g.regio_id,
          ${pointsAggregate} AS points`;
}
