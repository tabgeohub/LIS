import { Request, Response } from "express";
import {
  entityExists,
  parseRouteEntityId,
  runInTransaction,
  sendDeleteError,
} from "../../helpers/entities/entityDeleteHelpers";
import { deletePointInTransaction } from "./deletePointHelpers";

export async function deletePoint(req: Request, res: Response): Promise<void> {
  const pointId = parseRouteEntityId(req.params.id, "point");

  if (pointId == null) {
    res.status(400).json({ message: "Missing point id" });
    return;
  }

  try {
    if (!(await entityExists("points", pointId))) {
      res.status(404).json({ message: "Point not found" });
      return;
    }

    const result = await runInTransaction((client) =>
      deletePointInTransaction(client, pointId)
    );

    res.status(200).json({
      message: "Point deleted successfully",
      ...result,
    });
  } catch (err) {
    sendDeleteError({ res, entityLabel: "point", err });
  }
}
