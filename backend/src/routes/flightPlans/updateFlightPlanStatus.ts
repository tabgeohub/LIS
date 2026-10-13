import type { Request, Response } from "express";
import { pool } from "../../db";
import { updateFlightPlanStatus as updateRow } from "../../helpers/repositories/flightPlansRepo";
import { hasPlanRegionAccess, resolvePlanPrincipal } from "./planAccess";
export async function updateFlightPlanStatus(req: Request, res: Response): Promise<void> {
  const { id, status } = req.body ?? {};
  if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0 || typeof status !== "string" || !status.trim()) { res.status(400).json({ code: "INVALID_STATUS_REQUEST" }); return; }
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE" }); return; }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const plan = (await client.query("SELECT id, regio_id FROM lis.flightPlans WHERE id = $1 FOR UPDATE", [id])).rows[0];
    if (!plan || !hasPlanRegionAccess(principal, plan.regio_id)) {
      await client.query("ROLLBACK"); res.status(plan ? 403 : 404).json({ code: plan ? "PLAN_REGION_FORBIDDEN" : "PLAN_NOT_FOUND" }); return;
    }
    const result = await updateRow(client, { id, status: status.trim() });
    await client.query("COMMIT");
    res.status(200).json({ success: true, message: "Status van het vluchtplan succesvol bijgewerkt", result: result.rows[0] ?? null });
  } catch {
    try { await client.query("ROLLBACK"); } catch {}
    res.status(500).json({ code: "PLAN_STATUS_ERROR", message: "Bijwerken van het vluchtplan mislukt" });
  } finally { client.release(); }
}
