import { Request, Response } from "express";
import { missingFields } from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import {
  buildAttachmentLocation,
  insertAttachmentRow,
} from "./createAttachmentHelpers";

export async function createAttachment(
  req: Request,
  res: Response
): Promise<void> {
  const { url, pointId, attachmentId, taken_at, long, lat } = req.body;

  if (
    getMissingFields(req.body, ["pointId", "attachmentId", "taken_at", "url"])
      .length > 0
  ) {
    missingFields(res);
    return;
  }

  await insertAttachmentRow({
    res,
    url,
    pointId,
    attachmentId,
    taken_at,
    location: buildAttachmentLocation(lat, long),
  });
}
