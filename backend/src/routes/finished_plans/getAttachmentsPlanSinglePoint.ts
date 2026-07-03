import { Request, Response } from "express";
import { fetchAttachmentsForPlanPoint } from "../../helpers/queries/finished-plans/fetchAttachmentsForPlanPoint";

export async function getAttachmentsPlanSinglePoint(
  req: Request,
  res: Response
): Promise<void> {
  const { planId, pointId } = req.query;

  if (!planId || !pointId) {
    res.status(400).json({ message: "Missing planId or pointId parameter" });
    return;
  }

  try {
    const rows = await fetchAttachmentsForPlanPoint({
      planId: parseInt(planId as string, 10),
      pointId: parseInt(pointId as string, 10),
    });
    res.status(200).json(rows);
  } catch (err) {
    console.error(
      "Error fetching attachments for plan single point:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      message: `Failed to fetch attachments. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
