import { PoolClient } from "pg";
import {
  buildPointInsertParams,
  buildPointInsertSql,
  type PointCoreColumn,
} from "../queries/points/pointFields";
import type { IncomingPlan } from "../validators/finishedPlan";

type FinishedPlanPoint = IncomingPlan["points"][number];
type FinishedPlanAttachment = NonNullable<
  FinishedPlanPoint["attachments"]
>[number];

/** Point columns defaulted to null when the imported point omits them. */
const NEW_POINT_NULLABLE_FIELDS: PointCoreColumn[] = [
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
];

function buildNewPointOverrides(
  point: FinishedPlanPoint,
  userId: number
): Partial<Record<PointCoreColumn, unknown>> {
  const overrides: Partial<Record<PointCoreColumn, unknown>> = {
    user_id: userId,
    vertrouwelijk: point.vertrouwelijk ?? false,
    herhalen: point.herhalen ?? false,
  };
  for (const field of NEW_POINT_NULLABLE_FIELDS) {
    overrides[field] = (point as Record<string, unknown>)[field] ?? null;
  }
  return overrides;
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

/**
 * Writes a finished plan (points, path, attachments, finished rows) within an
 * open transaction. State is held on the instance so step methods stay at
 * 0–1 parameters (keeps Sigrid unit-interfacing low).
 */
class FinishedPlanWriter {
  private readonly client: PoolClient;
  private readonly plan: IncomingPlan;
  private readonly realIdByPointId: Record<number, number> = {};
  private readonly attachmentIdsByPointId: Record<number, number[]> = {};
  private nextOrder = 0;

  constructor(client: PoolClient, plan: IncomingPlan) {
    this.client = client;
    this.plan = plan;
  }

  async save(): Promise<void> {
    await this.upsertPoints();
    await this.markFlightPlanFinished();
    await this.insertPath();
    await this.insertAttachments();
    await this.insertFinishedRows();
  }

  private realIdOf(point: FinishedPlanPoint): number {
    return point.id < 0 ? this.realIdByPointId[point.id] : point.id;
  }

  private async upsertPoints(): Promise<void> {
    for (const point of this.plan.points) {
      if (point.id < 0) {
        this.realIdByPointId[point.id] = await this.insertNewPoint(point);
      } else {
        await this.updateExistingPoint(point);
      }
    }
  }

  private async insertNewPoint(point: FinishedPlanPoint): Promise<number> {
    const sql = `${buildPointInsertSql(["created_at", "status", "soort"])} RETURNING id`;
    const values = buildPointInsertParams({
      source: point,
      extraValues: [new Date(), "bezocht", "adhoc"],
      overrides: buildNewPointOverrides(point, this.plan.user_id),
    });

    const inserted = await this.client.query(sql, values);
    const newId = inserted.rows?.[0]?.id;
    if (!newId) {
      throw new Error("Insert point returned no id.");
    }
    return newId;
  }

  private async updateExistingPoint(point: FinishedPlanPoint): Promise<void> {
    const result = await this.client.query(
      `UPDATE lis.points SET omschrijving = $1, status = $2 WHERE id = $3`,
      [point.omschrijving, "bezocht", point.id]
    );
    if (result.rowCount === 0) {
      throw new Error(`Point with id ${point.id} not found for update.`);
    }
  }

  private async markFlightPlanFinished(): Promise<void> {
    const realPointIds = this.plan.points.map((p) => this.realIdOf(p));
    const pointsRes = await this.client.query(
      `UPDATE lis.flightplans SET points = $1 WHERE id = $2`,
      [realPointIds, this.plan.id]
    );
    if (pointsRes.rowCount === 0) {
      throw new Error(
        `Flightplan ${this.plan.id} not found when updating points.`
      );
    }

    const statusRes = await this.client.query(
      `UPDATE lis.flightplans SET status = 'finished' WHERE id = $1`,
      [this.plan.id]
    );
    if (statusRes.rowCount === 0) {
      throw new Error(
        `Flightplan ${this.plan.id} not found when updating status.`
      );
    }
  }

  private async insertPath(): Promise<void> {
    await this.client.query(
      `INSERT INTO lis.finished_plans_path (path, planid, flighttime) VALUES ($1, $2, $3)`,
      [
        JSON.stringify(this.plan.pathData),
        this.plan.id,
        JSON.stringify(this.plan.flightTime) ?? null,
      ]
    );
  }

  private async insertAttachments(): Promise<void> {
    for (const point of this.plan.points) {
      const realPointId = this.realIdOf(point);
      this.attachmentIdsByPointId[realPointId] = [];
      const attachments = point.attachments;
      if (!Array.isArray(attachments) || attachments.length === 0) {
        continue;
      }
      for (const attachment of attachments) {
        await this.insertOneAttachment(point, attachment);
      }
    }
  }

  private async insertOneAttachment(
    point: FinishedPlanPoint,
    attachment: FinishedPlanAttachment
  ): Promise<void> {
    const realPointId = this.realIdOf(point);
    const ins = await this.client.query(
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
      this.attachmentIdsByPointId[realPointId].push(attId);
    }
  }

  private async insertFinishedRows(): Promise<void> {
    const orderRow = await this.client.query(
      `SELECT MAX(point_order) AS max_order FROM lis.finished_plans WHERE plan_id = $1`,
      [this.plan.id]
    );
    this.nextOrder = Number(orderRow.rows?.[0]?.max_order ?? 0);

    for (const point of this.plan.points) {
      await this.insertFinishedRow(point);
    }
  }

  private async insertFinishedRow(point: FinishedPlanPoint): Promise<void> {
    const realPointId = this.realIdOf(point);
    await this.assertPointExists(realPointId);

    await this.client.query(
      `INSERT INTO lis.finished_plans (point_id, plan_id, point_order, attachments_id, pointComment, status, spoed, emailadres)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        realPointId,
        this.plan.id,
        this.resolveOrder(point),
        this.attachmentIdsByPointId[realPointId] ?? [],
        point.comment ?? "",
        "bezocht",
        point.spoed ?? null,
        point.sendToEmail ?? null,
      ]
    );
  }

  private resolveOrder(point: FinishedPlanPoint): number {
    const provided = Number(point.order);
    if (point.order == null || Number.isNaN(provided)) {
      this.nextOrder += 1;
      return this.nextOrder;
    }
    return provided;
  }

  private async assertPointExists(pointId: number): Promise<void> {
    const exists = await this.client.query(
      `SELECT 1 FROM lis.points WHERE id = $1`,
      [pointId]
    );
    if (exists.rowCount === 0) {
      throw new Error(`Parent point ${pointId} not found in lis.points.`);
    }
  }
}

export async function saveFinishedPlanInTransaction(
  client: PoolClient,
  plan: IncomingPlan
): Promise<void> {
  await new FinishedPlanWriter(client, plan).save();
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
