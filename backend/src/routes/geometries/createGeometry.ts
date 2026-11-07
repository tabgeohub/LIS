import { Request, Response } from "express";
import { pool } from "../../db";
import {
  commitAndRespondCreateGeometry,
  rejectInvalidCreateGeometryBody,
  rollbackCreateGeometryError,
} from "./createGeometryHelpers";
import { authorizeCreateRegion } from "../flightPlans/planAccess";

export async function createGeometry(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (!(await authorizeCreateRegion(req, res, body?.regio_id))) return;

  if (rejectInvalidCreateGeometryBody(body, res)) return;

  const client = await pool.connect();

  try {
    await commitAndRespondCreateGeometry({ client, body, res });
  } catch (err) {
    await rollbackCreateGeometryError({ client, res, err });
  } finally {
    client.release();
  }
}
