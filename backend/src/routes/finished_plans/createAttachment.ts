import { Request, Response } from "express";
import { rejectIfMissingFields } from "../../helpers/http/rejectIfMissingFields";
import {
  buildAttachmentLocation,
  insertAttachmentRow,
} from "./createAttachmentHelpers";
import { authorizeEntityRegion } from "../flightPlans/entityRegionAccess";

export async function createAttachment(
  req: Request,
  res: Response
): Promise<void> {
  const { url, pointId, attachmentId, taken_at, long, lat } = req.body;

  if (
    rejectIfMissingFields({
      res,
      body: req.body,
      fields: ["pointId", "attachmentId", "taken_at", "url"],
    })
  ) {
    return;
  }
  if (!(await authorizeEntityRegion(req, res, "points", pointId))) return;

  await insertAttachmentRow({
    res,
    url,
    pointId,
    attachmentId,
    taken_at,
    location: buildAttachmentLocation(lat, long),
  });
}
