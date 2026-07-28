import type { Queryable } from "./queryable";

export async function insertAttachment(
  db: Queryable,
  input: {
    url: unknown;
    pointId: unknown;
    attachmentId: unknown;
    taken_at: unknown;
    location: string | null;
    /** Column casing differs historically between call sites. */
    attachmentIdColumn?: "attachmentid" | "attachmentId";
  }
) {
  const col = input.attachmentIdColumn ?? "attachmentid";
  return db.query(
    `INSERT INTO lis.attachments (url, point_id, ${col}, taken_at, location) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [input.url, input.pointId, input.attachmentId, input.taken_at, input.location]
  );
}

export async function insertAttachmentReturningId(
  db: Queryable,
  input: {
    url: unknown;
    pointId: unknown;
    attachmentId: unknown;
    taken_at: unknown;
    location: string | null;
  }
) {
  return db.query(
    `INSERT INTO lis.attachments (url, point_id, attachmentId, taken_at, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
    [input.url, input.pointId, input.attachmentId, input.taken_at, input.location]
  );
}

export async function selectAttachmentsByIds(
  db: Queryable,
  ids: number[]
) {
  return db.query(
    `
      SELECT *
      FROM lis.attachments
      WHERE id = ANY($1::int[])
      ORDER BY taken_at ASC;
    `,
    [ids]
  );
}

export async function deleteAttachmentsByIds(
  db: Queryable,
  ids: number[]
) {
  if (ids.length === 0) {
    return { rowCount: 0, rows: [] };
  }
  return db.query(`DELETE FROM lis.attachments WHERE id = ANY($1::int[])`, [
    ids,
  ]);
}

export async function deleteAttachmentsByPointId(
  db: Queryable,
  pointId: number
) {
  return db.query(`DELETE FROM lis.attachments WHERE point_id = $1`, [
    pointId,
  ]);
}

export async function deleteAttachmentsByPointIds(
  db: Queryable,
  pointIds: number[]
) {
  if (pointIds.length === 0) {
    return { rowCount: 0, rows: [] };
  }
  return db.query(
    `DELETE FROM lis.attachments WHERE point_id = ANY($1::int[])`,
    [pointIds]
  );
}

export async function deleteOrphanedAttachments(
  db: Queryable,
  ids: number[]
) {
  if (ids.length === 0) {
    return { rowCount: 0, rows: [] };
  }
  return db.query(
    `
      DELETE FROM lis.attachments a
      WHERE a.id = ANY($1::int[])
      AND NOT EXISTS (
        SELECT 1 FROM lis.finished_plans fp
        WHERE a.id = ANY(fp.attachments_id)
      )
    `,
    [ids]
  );
}
