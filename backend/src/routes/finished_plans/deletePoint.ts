import { Request, Response } from "express";
import { runInTransaction } from "../../helpers/entities/entityDeleteHelpers";
import { deleteAttachmentsByIds } from "../../helpers/repositories/attachmentsRepo";
import { deleteFinishedPlanByPlanAndPoint } from "../../helpers/repositories/finishedPlansRepo";
import { arrayRemovePointFromFlightPlan } from "../../helpers/repositories/flightPlansRepo";

export async function deletePoint(req: Request, res: Response): Promise<void> {
  const { data } = req.params;

  if (!data) {
    res.status(400).json({ message: "Missing data" });
    return;
  }

  try {
    const { point_id, plan_id, attachments } = JSON.parse(data);

    await runInTransaction(async (client) => {
      if (attachments && attachments.length > 0) {
        await deleteAttachmentsByIds(client, attachments);
      }

      await deleteFinishedPlanByPlanAndPoint(client, {
        planId: plan_id,
        pointId: point_id,
      });

      await arrayRemovePointFromFlightPlan(client, {
        pointId: point_id,
        planId: plan_id,
      });
    });

    res
      .status(200)
      .json({ message: "Point and related data removed successfully" });
  } catch (error) {
    console.error("Error removing point:", error);
    res.status(500).json({ message: "Failed to remove point" });
  }
}
