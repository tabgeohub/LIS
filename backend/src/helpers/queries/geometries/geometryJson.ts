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
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "user_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
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
