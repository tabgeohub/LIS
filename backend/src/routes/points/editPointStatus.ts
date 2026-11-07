import { pool } from "../../db";
import { createStatusUpdateHandler } from "../../helpers/http/createStatusUpdateHandler";
import { updatePointStatus } from "../../helpers/repositories/pointsRepo";
import type { Request, Response } from "express";
import { authorizeEntityRegion } from "../flightPlans/entityRegionAccess";

const updateStatus = createStatusUpdateHandler({
  runQuery: (id, status) =>
    updatePointStatus(pool, {
      id: id as string | number,
      status: String(status),
    }),
  config: {
    notFoundMessage: "Aandachtspunt niet gevonden",
    successMessage: "Aandachtspunt succesvol bijgewerkt",
    logLabel: "Error updating point status:",
    errorMessage: "Failed to update point status:",
  },
});
export async function editPointStatus(req: Request, res: Response): Promise<void> {
  if (!(await authorizeEntityRegion(req, res, "points", req.body?.id))) return;
  await updateStatus(req, res);
}
