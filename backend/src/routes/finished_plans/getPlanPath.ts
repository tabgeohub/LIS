import { Request, Response } from "express";
import { pool } from "../../db";
import { selectPathsByPlanId } from "../../helpers/repositories/finishedPlansPathRepo";
import { authorizeFinishedPlan } from "./authorizeFinishedPlan";

export async function getPlanPath(req: Request, res: Response): Promise<void> {
  const { planId } = req.params;

  try {
    if (!(await authorizeFinishedPlan(req, res, planId))) return;
    const result = await selectPathsByPlanId(pool, planId);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching finished flightplans:", error);
    res.status(500).json({ message: "Failed to fetch finished flightplans" });
  }
}
