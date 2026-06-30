import { PoolClient } from "pg";
import {
  buildPointInsertParams,
  buildPointInsertSql,
} from "./queries/pointFields";
import type { IncomingPlan } from "./validators/finishedPlan";

type FinishedPlanPoint = IncomingPlan["points"][number];
type FinishedPlanAttachment = NonNullable<FinishedPlanPoint["attachments"]>[number];

export type NegativeIdMap = Record<number, number>;
export type AttachmentsByPointId = Record<number, number[]>;

export async function saveFinishedPlanInTransaction(
  client: PoolClient,
  plan: IncomingPlan
): Promise<void> {
  const negativeIdToRealId = await upsertPlanPoints(client, plan);
  const realPointIds = resolveRealPointIds(plan.points, negativeIdToRealId);
  await markFlightPlanFinished(client, plan.id, realPointIds);
  await insertFinishedPlanPath(client, plan);
  const attachmentsMap = await insertPointAttachments(
    client,
    plan,
    negativeIdToRealId
  );
  await insertFinishedPlanPointRows(
    client,
    plan,
    negativeIdToRealId,
    attachmentsMap
  );
}

function resolveRealPointId(
  pointId: number,
  negativeIdToRealId: NegativeIdMap
): number {
  return pointId < 0 ? negativeIdToRealId[pointId] : pointId;
}

function resolveRealPointIds(
  points: FinishedPlanPoint[],
  negativeIdToRealId: NegativeIdMap
): number[] {
  return points.map((p) => resolveRealPointId(p.id, negativeIdToRealId));
}

async function upsertPlanPoints(
  client: PoolClient,
  plan: IncomingPlan
): Promise<NegativeIdMap> {
  const negativeIdToRealId: NegativeIdMap = {};

  for (const point of plan.points) {
    if (point.id < 0) {
      negativeIdToRealId[point.id] = await insertNewPlanPoint(
        client,
        point,
        plan.user_id
      );
      continue;
    }
    await updateExistingPlanPoint(client, point);
  }

  return negativeIdToRealId;
}

async function insertNewPlanPoint(
  client: PoolClient,
  point: FinishedPlanPoint,
  userId: number
): Promise<number> {
  const insertSql = `${buildPointInsertSql([
    "created_at",
    "status",
    "soort",
  ])} RETURNING id`;

  const insertValues = buildPointInsertParams(
    point,
    [new Date(), "bezocht", "adhoc"],
    {
      regio_id: point.regio_id ?? null,
      xcoordinaat_rd: point.xcoordinaat_rd ?? null,
      ycoordinaat_rd: point.ycoordinaat_rd ?? null,
      latitude: point.latitude ?? null,
      longitude: point.longitude ?? null,
      vertrouwelijk: point.vertrouwelijk ?? false,
      herhalen: point.herhalen ?? false,
      user_id: userId,
      activiteit_id: point.activiteit_id ?? null,
      organisatie_id: point.organisatie_id ?? null,
      specifiek_letten_op: point.specifiek_letten_op ?? null,
    }
  );

  const inserted = await client.query(insertSql, insertValues);
  const newId = inserted.rows?.[0]?.id;

  if (!newId) {
    throw new Error("Insert point returned no id.");
  }

  return newId;
}

async function updateExistingPlanPoint(
  client: PoolClient,
  point: FinishedPlanPoint
): Promise<void> {
  const result = await client.query(
    `UPDATE lis.points SET omschrijving = $1, status = $2 WHERE id = $3`,
    [point.omschrijving, "bezocht", point.id]
  );

  if (result.rowCount === 0) {
    throw new Error(`Point with id ${point.id} not found for update.`);
  }
}

async function markFlightPlanFinished(
  client: PoolClient,
  planId: number,
  realPointIds: number[]
): Promise<void> {
  const updatePointsRes = await client.query(
    `UPDATE lis.flightplans SET points = $1 WHERE id = $2`,
    [realPointIds, planId]
  );
  if (updatePointsRes.rowCount === 0) {
    throw new Error(`Flightplan ${planId} not found when updating points.`);
  }

  const statusRes = await client.query(
    `UPDATE lis.flightplans SET status = 'finished' WHERE id = $1`,
    [planId]
  );
  if (statusRes.rowCount === 0) {
    throw new Error(`Flightplan ${planId} not found when updating status.`);
  }
}

async function insertFinishedPlanPath(
  client: PoolClient,
  plan: IncomingPlan
): Promise<void> {
  await client.query(
    `INSERT INTO lis.finished_plans_path (path, planid, flighttime) VALUES ($1, $2, $3)`,
    [JSON.stringify(plan.pathData), plan.id, JSON.stringify(plan.flightTime) ?? null]
  );
}

function resolveAttachmentLocation(
  attachment: FinishedPlanAttachment,
  point: FinishedPlanPoint
): string | null {
  if (attachment.lat != null && attachment.long != null) {
    return `${attachment.lat},${attachment.long}`;
  }
  if (point.latitude != null && point.longitude != null) {
    return `${point.latitude},${point.longitude}`;
  }
  return null;
}

async function insertPointAttachments(
  client: PoolClient,
  plan: IncomingPlan,
  negativeIdToRealId: NegativeIdMap
): Promise<AttachmentsByPointId> {
  const attachmentsMap: AttachmentsByPointId = {};

  for (const point of plan.points) {
    const realPointId = resolveRealPointId(point.id, negativeIdToRealId);
    attachmentsMap[realPointId] = [];

    if (!Array.isArray(point.attachments) || point.attachments.length === 0) {
      continue;
    }

    for (const attachment of point.attachments) {
      const ins = await client.query(
        `INSERT INTO lis.attachments (url, point_id, attachmentId, taken_at, location)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
          attachment.url,
          realPointId,
          attachment.objectId ?? null,
          attachment.taken_at ?? null,
          resolveAttachmentLocation(attachment, point),
        ]
      );
      const attId = ins.rows?.[0]?.id;
      if (attId) {
        attachmentsMap[realPointId].push(attId);
      }
    }
  }

  return attachmentsMap;
}

function resolvePointOrder(
  point: FinishedPlanPoint,
  maxOrder: { value: number }
): number {
  if (
    point.order === undefined ||
    point.order === null ||
    Number.isNaN(Number(point.order))
  ) {
    maxOrder.value += 1;
    return maxOrder.value;
  }
  return Number(point.order);
}

async function insertFinishedPlanPointRows(
  client: PoolClient,
  plan: IncomingPlan,
  negativeIdToRealId: NegativeIdMap,
  attachmentsMap: AttachmentsByPointId
): Promise<void> {
  const orderRow = await client.query(
    `SELECT MAX(point_order) AS max_order FROM lis.finished_plans WHERE plan_id = $1`,
    [plan.id]
  );
  const maxOrder = { value: Number(orderRow.rows?.[0]?.max_order ?? 0) };

  for (const point of plan.points) {
    const realPointId = resolveRealPointId(point.id, negativeIdToRealId);
    await assertPointExists(client, realPointId);

    await client.query(
      `INSERT INTO lis.finished_plans (point_id, plan_id, point_order, attachments_id, pointComment, status, spoed, emailadres)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        realPointId,
        plan.id,
        resolvePointOrder(point, maxOrder),
        attachmentsMap[realPointId] ?? [],
        point.comment ?? "",
        "bezocht",
        point.spoed ?? null,
        point.sendToEmail ?? null,
      ]
    );
  }
}

async function assertPointExists(
  client: PoolClient,
  pointId: number
): Promise<void> {
  const exists = await client.query(`SELECT 1 FROM lis.points WHERE id = $1`, [
    pointId,
  ]);
  if (exists.rowCount === 0) {
    throw new Error(`Parent point ${pointId} not found in lis.points.`);
  }
}

export async function rollbackFinishedPlanTransaction(
  client: PoolClient
): Promise<void> {
  try {
    await client.query("ROLLBACK");
  } catch {
    // ignore rollback errors
  }
}
