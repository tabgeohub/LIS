import { Request, Response } from "express";
import {
  fetchGeometryWithPoints,
  sendGetGeometryError,
} from "./getSingleGeometryHelpers";

export async function getSingleGeometry(
  req: Request,
  res: Response
): Promise<void> {
  const { geometry_id } = req.params;

  if (!geometry_id) {
    res.status(400).json({
      result: null,
      message: "geometry_id is required",
    });
    return;
  }

  try {
    const result = await fetchGeometryWithPoints(geometry_id);
    if (!result) {
      res.status(404).json({
        result: null,
        message: "Geometry not found",
      });
      return;
    }

    res.status(200).json({
      result,
      message: "Geometry retrieved successfully",
    });
  } catch (err) {
    sendGetGeometryError(res, err);
  }
}
