import { Request, Response } from "express";
import { pool } from "../../db";

export async function deletePoint(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Missing point id" });
    return;
  }

  try {
    const result = await pool.query(
      "DELETE FROM lis.points WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Point not found" });
      return;
    }

    res.status(200).json({
      message: "Point deleted successfully",
      deletedPoint: result.rows[0],
    });
  } catch (err) {
    console.error(
      "Error deleting point:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      message: `Failed to delete point. Error : ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
