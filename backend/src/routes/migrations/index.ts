import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { createRequireAdmin } from "../../helpers/auth/realmAdminAuth";
import { migrationConfig, configuredForSource } from "./config";

const router = Router();
/** Kept mounted so former internal migration paths return a normal 404. */
export const migrationInternalRouter = Router();

function config(req: Request) { return migrationConfig(req.hostname); }
function disabled(res: Response) {
  res.status(404).json({ code: "MIGRATION_DISABLED", message: "Finished-flight listing is available on localhost only" });
}

/**
 * Local inspection only. This reads existing LIS tables and deliberately has no
 * export, preview, transfer, status, or mutation route.
 */
router.get("/flights", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req);
  if (!configuredForSource(configured)) { disabled(res); return; }
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 50);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  try {
    const result = await pool.query(
      `SELECT fp.id, fp.vluchtnummer, fp.datum, fp.regio_id,
              (SELECT count(*)::int FROM lis.finished_plans f WHERE f.plan_id = fp.id) AS completion_count
         FROM lis.flightplans fp
        WHERE fp.status = 'finished'
        ORDER BY fp.datum DESC NULLS LAST, fp.id DESC
        LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({
      flights: result.rows.map((row) => ({ ...row, migrationStatus: "Status unavailable" })),
      limit,
      offset,
      readOnly: true,
    });
  } catch {
    res.status(500).json({ code: "FINISHED_FLIGHTS_UNAVAILABLE", message: "Finished flights are unavailable" });
  }
});

export default router;
