import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";
import {
  finishedPlanFail,
  finishedPlanOk,
  validateFinishedPlan,
} from "../../helpers/validators/finishedPlan";
import {
  buildPointInsertParams,
  buildPointInsertSql,
} from "../../helpers/queries/pointFields";

export async function createFinishedPlan(
  req: Request,
  res: Response
): Promise<void> {
  const validated = validateFinishedPlan(req.body);
  if (!validated.ok) {
    finishedPlanFail(res, 400, "ERR_VALIDATION", validated.reason);
    return;
  }
  const plan = validated.plan;

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
  } catch (e) {
    finishedPlanFail(
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

    for (const point of plan.points) {
      const isNew = point.id < 0;

      if (isNew) {
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
            user_id: plan.user_id,
            activiteit_id: point.activiteit_id ?? null,
            organisatie_id: point.organisatie_id ?? null,
            specifiek_letten_op: point.specifiek_letten_op ?? null,
          }
        );

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

    const statusRes = await client.query(
      `UPDATE lis.flightplans SET status = 'finished' WHERE id = $1`,
      [plan.id]
    );
    if (statusRes.rowCount === 0) {
      throw new Error(`Flightplan ${plan.id} not found when updating status.`);
    }

    await client.query(
      `INSERT INTO lis.finished_plans_path (path, planid, flighttime) VALUES ($1, $2, $3)`,
      [
        JSON.stringify(plan.pathData),
        plan.id,
        JSON.stringify(plan.flightTime) ?? null,
      ]
    );

    const attachmentsMap: Record<number, number[]> = {};
    for (const point of plan.points) {
      const realPointId =
        point.id < 0 ? negativeIdToRealId[point.id] : point.id;
      attachmentsMap[realPointId] = [];

      if (Array.isArray(point.attachments) && point.attachments.length > 0) {
        for (const attachment of point.attachments) {
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

    finishedPlanOk(
      res,
      { message: "Vluchtplan succesvol opgeslagen", planId: plan.id },
      200
    );
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    const msg = e instanceof Error ? e.message : String(e);
    finishedPlanFail(res, 500, "ERR_DB_TRANSACTION", "Failed to save finished plan.", msg);
  } finally {
    client.release();
  }
}
