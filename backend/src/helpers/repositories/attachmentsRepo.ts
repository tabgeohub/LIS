import type { Queryable } from "./queryable";
import { ATTACHMENT_IN_FINISHED_PLANS_EXISTS_SQL } from "./finishedPlansQuerySql";

type AttachmentInsertInput = {
  url: unknown;
  pointId: unknown;
  attachmentId: unknown;
  taken_at: unknown;
  location: string | null;
};

function attachmentInsertParams(input: AttachmentInsertInput) {
  return [
    input.url,
    input.pointId,
    input.attachmentId,
    input.taken_at,
    input.location,
  ];
}

function attachmentInsertSql(
  attachmentIdColumn: "attachmentid" | "attachmentId",
  returning: string
) {
  return `INSERT INTO lis.attachments (url, point_id, ${attachmentIdColumn}, taken_at, location) VALUES ($1, $2, $3, $4, $5) ${returning}`;
}

export async function insertAttachment(
  db: Queryable,
  input: AttachmentInsertInput & {
    /** Column casing differs historically between call sites. */
    attachmentIdColumn?: "attachmentid" | "attachmentId";
  }
) {
  const col = input.attachmentIdColumn ?? "attachmentid";
  return db.query(
    attachmentInsertSql(col, "RETURNING *;"),
    attachmentInsertParams(input)
  );
}

export async function insertAttachmentReturningId(
  db: Queryable,
  input: AttachmentInsertInput
) {
  return db.query(
    attachmentInsertSql("attachmentId", "RETURNING id"),
    attachmentInsertParams(input)
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
        ${ATTACHMENT_IN_FINISHED_PLANS_EXISTS_SQL}
      )
    `,
    [ids]
  );
}
