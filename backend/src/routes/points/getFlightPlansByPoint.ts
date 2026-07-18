import { Request, Response } from "express";
import {
  queryFlightPlansByPoint,
  sendFlightPlansByPointError,
} from "./getFlightPlansByPointHelpers";

export async function getFlightPlansByPoint(
  req: Request,
  res: Response
): Promise<void> {
  const { pointId } = req.params;

  if (!pointId) {
    res.status(400).json({ message: "Missing pointId parameter" });
    return;
  }

  try {
    const rows = await queryFlightPlansByPoint(pointId);
    res.status(200).json(rows);
  } catch (err) {
    sendFlightPlansByPointError(res, err);
  }
}
