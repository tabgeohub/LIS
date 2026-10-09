import { Request, Response } from "express";
import { pool } from "../../db";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";
import { selectPreparedFlightPlans } from "../../helpers/repositories/flightPlansRepo";
import { denyMissingPlanIdentity, resolvePlanPrincipal } from "./planAccess";

export async function getPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    // A query parameter can only narrow an admin view. A regional account is
    // always scoped to its Keycloak region, never to a caller-provided value.
    const regio_id = principal.is_admin ? resolveRegioFilter(req) : principal.regio_id ?? undefined;
    const result = await selectPreparedFlightPlans(pool, regio_id);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching prepared flight plans:", err);
    res.status(500).json({
      result: null,
      message: `Failed to fetch prepared flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
