import { Request, Response } from "express";
import { pool } from "../../db";

export async function createGeometry(req: Request, res: Response): Promise<void> {
  const {
    omschrijving,
    organisatie,
    vertrouwelijk,
    herhalen,
    activiteit,
    specifiekLettenOp,
    geometry_type,
    regio_id,
    points, // Array of points to insert
  } = req.body;

  if (!omschrijving || !organisatie || !geometry_type || !points || !Array.isArray(points) || points.length === 0) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken.",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert into geometries table
    // Note: Column names should match the database schema (likely snake_case or camelCase)
    const geometryResult = await client.query(
      `INSERT INTO lis.geometries (
        omschrijving,
        organisatie,
        vertrouwelijk,
        herhalen,
        activiteit,
        specifiek_letten_op,
        type,
        regio_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        omschrijving,
        organisatie,
        vertrouwelijk ? 1 : 0,
        herhalen ? 1 : 0,
        activiteit,
        specifiekLettenOp,
        geometry_type,
        regio_id,
      ]
    );

    const geometryId = geometryResult.rows[0].id;

    // Insert all points with the geometry_id
    const insertedPoints = [];
    for (const point of points) {
      const pointResult = await client.query(
        `INSERT INTO lis.points (
          omschrijving,
          regio_id,
          xcoordinaat_rd,
          ycoordinaat_rd,
          latitude,
          longitude,
          vertrouwelijk,
          herhalen,
          user_id,
          activiteit_id,
          organisatie_id,
          specifiek_letten_op,
          geometry_id,
          soort,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
        [
          point.omschrijving,
          point.regio_id,
          point.xcoordinaat_rd,
          point.ycoordinaat_rd,
          point.latitude,
          point.longitude,
          point.vertrouwelijk,
          point.herhalen,
          point.user_id,
          point.activiteit,
          point.organisatie,
          point.specifiekLettenOp,
          geometryId,
          "permanent",
          "niet bezocht",
          new Date(),
        ]
      );
      insertedPoints.push(pointResult.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      result: {
        geometry: geometryResult.rows[0],
        points: insertedPoints,
      },
      geometry_id: geometryId,
      message: "Geometrie en punten succesvol aangemaakt",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      "Error creating geometry:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Error : ${err instanceof Error ? err.message : String(err)}`,
    });
  } finally {
    client.release();
  }
}

