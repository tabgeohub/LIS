import type { Request, Response } from "express";
import { pool } from "../../db";
import { denyMissingPlanIdentity, denyPlanRegion, hasPlanRegionAccess, resolvePlanPrincipal } from "./planAccess";

/** Check persisted entity region; never trust a body-supplied region or owner. */
export async function authorizeEntityRegion(req: Request, res: Response, table: "points" | "geometries", id: unknown): Promise<boolean> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { denyMissingPlanIdentity(res); return false; }
  const rows = await pool.query<{ regio_id: string | null }>(`SELECT regio_id FROM lis.${table} WHERE id=$1`, [id]);
  if (!rows.rows[0]) { res.status(404).json({ code: "ENTITY_NOT_FOUND", message: "Entity was not found" }); return false; }
  if (!hasPlanRegionAccess(principal, rows.rows[0].regio_id)) { denyPlanRegion(res); return false; }
  return true;
}
