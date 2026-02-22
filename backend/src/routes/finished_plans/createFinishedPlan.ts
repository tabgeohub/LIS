import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";
import { EnrichedPointType } from "../../Types";

function ok(res: Response, data: unknown, status = 200) {
  return res.status(status).json(data);
}
function fail(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  return res.status(status).json({ error: { code, message, details } });
}

type Attachment = {
  url: string;
  objectId?: number | string | null;
  taken_at?: string | Date | null;
  long?: number | null;
  lat?: number | null;
};

type IncomingPoint = EnrichedPointType & {
  attachments?: Attachment[] | null;
  order?: number | null;
  comment: string | null;
  spoed?: number | null;
  sendToEmail?: string | null;
};

type IncomingPlan = {
  id: number;
  user_id: number;
  points: IncomingPoint[];
  pathData?: unknown;
  flightTime?: string | number | null;
};

function isNonEmptyArray<T>(x: unknown): x is T[] {
  return Array.isArray(x) && x.length >= 0;
}

function validatePlan(
  raw: any
): { ok: true; plan: IncomingPlan } | { ok: false; reason: string } {
  if (!raw || typeof raw !== "object")
    return { ok: false, reason: "Request body must be a JSON object." };

  const { plan } = raw as { plan?: any };
  if (!plan || typeof plan !== "object")
    return { ok: false, reason: "`plan` is required and must be an object." };

  if (typeof plan.id !== "number" || !Number.isInteger(plan.id))
    return { ok: false, reason: "`plan.id` must be an integer." };

  if (!isNonEmptyArray<IncomingPoint>(plan.points))
    return {
      ok: false,
      reason: "`plan.points` must be an array (can be empty if needed).",
    };

  for (const [i, p] of plan.points.entries()) {
    if (typeof p !== "object")
      return { ok: false, reason: `points[${i}] must be an object.` };
    if (typeof p.id !== "number")
      return { ok: false, reason: `points[${i}].id must be a number.` };
    if (typeof p.omschrijving !== "string")
      return {
        ok: false,
        reason: `points[${i}].omschrijving must be a string.`,
      };
  }

  return { ok: true, plan };
}

export async function createFinishedPlan(
  req: Request,
  res: Response
): Promise<void> {
  const validated = validatePlan(req.body);
  if (!validated.ok) {
    fail(res, 400, "ERR_VALIDATION", validated.reason);
    return;
  }
  const plan = validated.plan;

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
  } catch (e) {
    fail(
      res,
      500,
      "ERR_DB_CONNECT",
      "Failed to acquire DB connection.",
      String(e)
    );
    return;
  }

  try {
    await client.query("BEGIN");

    const negativeIdToRealId: Record<number, number> = {};

    // 2) Upsert points
    for (const point of plan.points) {
      const isNew = point.id < 0;

      if (isNew) {
        const insertSql = `
          INSERT INTO lis.points (
            omschrijving,
            regio_id,
            xcoordinaat_rd,
            ycoordinaat_rd,
            latitude,
            longitude,
            vertrouwelijk,
            herhalen,
            user_id,
            activiteit_id,
            organisatie_id,
            specifiek_letten_op,
            created_at,
            status,
            soort
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, $14, $15)
          RETURNING id
        `;

        const insertValues = [
          point.omschrijving,
          point.regio_id ?? null,
          point.xcoordinaat_rd ?? null,
          point.ycoordinaat_rd ?? null,
          point.latitude ?? null,
          point.longitude ?? null,
          point.vertrouwelijk ?? false,
          point.herhalen ?? false,
          plan.user_id,
          point.activiteit_id ?? null,
          point.organisatie_id ?? null,
          point.specifiek_letten_op ?? null,
          new Date(),
          "bezocht",
          "adhoc",
        ];

        const inserted = await client.query(insertSql, insertValues);
        const newId = inserted.rows?.[0]?.id;

        if (!newId) throw new Error("Insert point returned no id.");

        negativeIdToRealId[point.id] = newId;
      } else {
        const updateSql = `
          UPDATE lis.points
          SET
            omschrijving = $1,
            status = $2
          WHERE id = $3
        `;
        const updateValues = [point.omschrijving, "bezocht", point.id];
        const result = await client.query(updateSql, updateValues);
        if (result.rowCount === 0) {
          throw new Error(`Point with id ${point.id} not found for update.`);
        }
      }
    }

    // 3) Replace negative IDs with newly created real IDs for the plan
    const realPointIds = plan.points.map((p) =>
      p.id < 0 ? negativeIdToRealId[p.id] : p.id
    );

    const updatePointsSql = `UPDATE lis.flightplans SET points = $1 WHERE id = $2`;
    const updatePointsRes = await client.query(updatePointsSql, [
      realPointIds,
      plan.id,
    ]);
    if (updatePointsRes.rowCount === 0) {
      throw new Error(`Flightplan ${plan.id} not found when updating points.`);
    }

    // 4) Mark plan status as finished
    const statusRes = await client.query(
      `UPDATE lis.flightplans SET status = 'finished' WHERE id = $1`,
      [plan.id]
    );
    if (statusRes.rowCount === 0) {
      throw new Error(`Flightplan ${plan.id} not found when updating status.`);
    }

    // 5) Insert path data
    await client.query(
      `INSERT INTO lis.finished_plans_path (path, planid, flighttime) VALUES ($1, $2, $3)`,
      [
        JSON.stringify(plan.pathData),
        plan.id,
        JSON.stringify(plan.flightTime) ?? null,
      ]
    );

    // 6) Insert attachments and map by point
    const attachmentsMap: Record<number, number[]> = {};
    for (const point of plan.points) {
      const realPointId =
        point.id < 0 ? negativeIdToRealId[point.id] : point.id;
      attachmentsMap[realPointId] = [];

      if (Array.isArray(point.attachments) && point.attachments.length > 0) {
        for (const attachment of point.attachments) {
          // Format location as "lat,long" if available from attachment, otherwise use point's location
          let location: string | null = null;
          if (attachment.lat !== undefined && attachment.lat !== null && attachment.long !== undefined && attachment.long !== null) {
            location = `${attachment.lat},${attachment.long}`;
          } else if (point.latitude !== undefined && point.latitude !== null && point.longitude !== undefined && point.longitude !== null) {
            location = `${point.latitude},${point.longitude}`;
          }

          const ins = await client.query(
            `INSERT INTO lis.attachments (url, point_id, attachmentId, taken_at, location)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [
              attachment.url,
              realPointId,
              attachment.objectId ?? null,
              attachment.taken_at ?? null,
              location,
            ]
          );
          const attId = ins.rows?.[0]?.id;
          if (attId) attachmentsMap[realPointId].push(attId);
        }
      }
    }

    // 7) Insert finished_plan rows in sequence (preserve provided order if any)
    const orderRow = await client.query(
      `SELECT MAX(point_order) AS max_order FROM lis.finished_plans WHERE plan_id = $1`,
      [plan.id]
    );
    let maxOrder: number = Number(orderRow.rows?.[0]?.max_order ?? 0);

    for (const point of plan.points) {
      const realPointId =
        point.id < 0 ? negativeIdToRealId[point.id] : point.id;

      const exists = await client.query(
        `SELECT 1 FROM lis.points WHERE id = $1`,
        [realPointId]
      );
      if (exists.rowCount === 0) {
        throw new Error(`Parent point ${realPointId} not found in lis.points.`);
      }

      const order =
        point.order === undefined ||
        point.order === null ||
        Number.isNaN(Number(point.order))
          ? ++maxOrder
          : Number(point.order);

      await client.query(
        `INSERT INTO lis.finished_plans (point_id, plan_id, point_order, attachments_id, pointComment, status, spoed, emailadres)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          realPointId,
          plan.id,
          order,
          attachmentsMap[realPointId] ?? [],
          point.comment ?? "",
          "bezocht",
          point.spoed ?? null,
          point.sendToEmail ?? null,
        ]
      );
    }

    await client.query("COMMIT");

    ok(
      res,
      { message: "Vluchtplan succesvol opgeslagen", planId: plan.id },
      200
    );
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    const msg = e instanceof Error ? e.message : String(e);
    fail(res, 500, "ERR_DB_TRANSACTION", "Failed to save finished plan.", msg);
  } finally {
    client.release();
  }
}
