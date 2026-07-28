import { Request, Response } from "express";
import {
  entityExists,
  parseRouteEntityId,
  removePointIdsFromFlightPlans,
  runInTransaction,
  sendDeleteError,
} from "../../helpers/entities/entityDeleteHelpers";
import { deleteGeometryCascade } from "./deleteGeometryCascade";

export async function deleteGeometry(req: Request, res: Response): Promise<void> {
  const geometryId = parseRouteEntityId(req.params.id, "geometry");

  if (geometryId == null) {
    res.status(400).json({ message: "Missing geometry id" });
    return;
  }

  try {
    if (!(await entityExists("geometries", geometryId))) {
      res.status(404).json({ message: "Geometry not found" });
      return;
    }

    const result = await runInTransaction(async (client) =>
      deleteGeometryCascade({
        client,
        geometryId,
        removePointIdsFromFlightPlans,
      })
    );

    res.status(200).json({
      message: "Geometry deleted successfully",
      ...result,
    });
  } catch (err) {
    sendDeleteError({ res, entityLabel: "geometry", err });
  }
}
