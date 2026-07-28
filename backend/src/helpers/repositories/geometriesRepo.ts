import type { Queryable } from "./queryable";
import type { CreateGeometryBody } from "../queries/geometries/createGeometryInsert";
import { buildCreateGeometryParams } from "../queries/geometries/createGeometryInsert";
import {
  buildGeometryMetadataValues,
  type GeometryMetadataInput,
} from "../queries/geometries/geometryMetadataValues";

export const CREATE_GEOMETRY_SQL = `INSERT INTO lis.geometries (
      omschrijving,
      organisatie,
      vertrouwelijk,
      herhalen,
      activiteit,
      specifiek_letten_op,
      type,
      regio_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

export const GEOMETRY_METADATA_UPDATE_SQL = `
      UPDATE lis.geometries SET
        omschrijving = COALESCE($1, omschrijving),
        organisatie = COALESCE($2, organisatie),
        vertrouwelijk = COALESCE($3, vertrouwelijk),
        herhalen = COALESCE($4, herhalen),
        activiteit = COALESCE($5, activiteit),
        specifiek_letten_op = COALESCE($6, specifiek_letten_op)
      WHERE id = $7
      RETURNING *`;

export async function geometryExistsById(
  db: Queryable,
  id: number | string
): Promise<boolean> {
  const result = await db.query(
    "SELECT id FROM lis.geometries WHERE id = $1",
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function selectGeometryById(
  db: Queryable,
  id: number | string
) {
  return db.query(`SELECT * FROM lis.geometries WHERE id = $1`, [id]);
}

export async function selectGeometryId(
  db: Queryable,
  id: number | string
) {
  return db.query(`SELECT id FROM lis.geometries WHERE id = $1`, [id]);
}

export async function insertGeometryReturningId(
  db: Queryable,
  body: CreateGeometryBody
) {
  return db.query(CREATE_GEOMETRY_SQL, buildCreateGeometryParams(body));
}

export async function updateGeometryMetadata(
  db: Queryable,
  input: { metadata: GeometryMetadataInput; geometryId: number }
) {
  return db.query(
    GEOMETRY_METADATA_UPDATE_SQL,
    buildGeometryMetadataValues(input.metadata, input.geometryId)
  );
}

export async function deleteGeometryById(
  db: Queryable,
  geometryId: number
) {
  return db.query(
    "DELETE FROM lis.geometries WHERE id = $1 RETURNING *",
    [geometryId]
  );
}
