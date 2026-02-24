import { Request, Response } from "express";
import { pool } from "../../db";

export async function getAllFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    let query = `
      SELECT
        fp.id AS id,
        fp.vluchtnummer,
        fp.omschrijving,
        fp.datum,
        fp.user_id,
        fp.status,
        fp.basemap,
        fp.created_at,
        fp.vliegduur,
        fp.luchtvaartuig,
        fp.passagiers,
        fp.hoofdthema,
        fp.regio_id,
        fp.aanvullende,
        fp.piloot,
        fp.waarnemer,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', pt.id,
            'omschrijving', pt.omschrijving,
            'xcoordinaat_rd', pt.xcoordinaat_rd,
            'ycoordinaat_rd', pt.ycoordinaat_rd,
            'latitude', pt.latitude,
            'longitude', pt.longitude,
            'regio_id', pt.regio_id,
            'herhalen', pt.herhalen,
            'vertrouwelijk', pt.vertrouwelijk,
            'user_id', pt.user_id,
            'organisatie_id', pt.organisatie_id,
            'specifiek_letten_op', pt.specifiek_letten_op,
            'activiteit_id', pt.activiteit_id,
            'created_at', pt.created_at,
            'geometry_id', pt.geometry_id,
            'geometry_type', g.type,
            'geometry_omschrijving', g.omschrijving
          )
        ) AS points
      FROM lis.flightPlans fp
      JOIN LATERAL UNNEST(fp.points) AS point_id ON TRUE
      JOIN lis.points pt ON pt.id = point_id
      LEFT JOIN lis.geometries g ON g.id = pt.geometry_id
      WHERE fp.status <> 'inactief'
    `;

    const params: any[] = [];

    if (regio_id && regio_id !== "admin") {
      params.push(regio_id);
      query += ` AND fp.regio_id = $${params.length}`;
    }

    query += ` GROUP BY fp.id ORDER BY fp.created_at DESC`;

    const result = await pool.query(query, params);

    // Format plans: group points with geometry_id into geometries array
    const formattedPlans = result.rows.map((plan: any) => {
      const points = plan.points || [];
      const pointsWithoutGeometry: any[] = [];
      const geometriesMap = new Map<number, any>();

      // Separate points with and without geometry_id
      points.forEach((point: any) => {
        if (point.geometry_id) {
          const geometryId = point.geometry_id;
          
          if (!geometriesMap.has(geometryId)) {
            geometriesMap.set(geometryId, {
              id: geometryId,
              type: point.geometry_type || null,
              omschrijving: point.geometry_omschrijving || null,
              points: [],
            });
          }
          
          // Remove geometry fields from point before adding to geometry
          const { geometry_id, geometry_type, geometry_omschrijving, ...pointWithoutGeometry } = point;
          geometriesMap.get(geometryId)!.points.push(pointWithoutGeometry);
        } else {
          // Remove geometry fields from point (they'll be null/undefined anyway)
          const { geometry_id, geometry_type, geometry_omschrijving, ...pointWithoutGeometry } = point;
          pointsWithoutGeometry.push(pointWithoutGeometry);
        }
      });

      return {
        ...plan,
        points: pointsWithoutGeometry,
        geometries: Array.from(geometriesMap.values()),
      };
    });

    res.status(200).json(formattedPlans);
  } catch (err) {
    console.error(
      "❌ Error fetching flight plans:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
