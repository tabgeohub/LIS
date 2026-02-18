import { Request, Response } from "express";
import { pool } from "../../db";

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
    // Get the geometry
    const geometryResult = await pool.query(
      `SELECT * FROM lis.geometries WHERE id = $1`,
      [geometry_id]
    );

    if (geometryResult.rows.length === 0) {
      res.status(404).json({
        result: null,
        message: "Geometry not found",
      });
      return;
    }

    const geometry = geometryResult.rows[0];

    // Get all points associated with this geometry
    const pointsResult = await pool.query(
      `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
      [geometry_id]
    );

    res.status(200).json({
      result: {
        ...geometry,
        points: pointsResult.rows,
      },
      message: "Geometry retrieved successfully",
    });
  } catch (err) {
    console.error(
      "Error fetching geometry:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch geometry: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}

