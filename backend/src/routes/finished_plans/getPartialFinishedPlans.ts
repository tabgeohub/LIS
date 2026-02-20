import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPartialFinishedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    const isAdmin = regio_id && regio_id.toString().toLowerCase() === "admin";
    const shouldFilter = regio_id && !isAdmin;

    const sql = `
      /* Ensure exactly one row per (plan_id, point_id) to avoid duplicates */
      WITH points_per_plan AS (
        SELECT DISTINCT
          plan_id,
          point_id
        FROM lis.finished_plans
      )
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            jsonb_build_object(
              'id',               pt.id,
              'omschrijving',     pt.omschrijving,
              'regio_id',         pt.regio_id,
              'xcoordinaat_rd',   pt.xcoordinaat_rd,
              'ycoordinaat_rd',   pt.ycoordinaat_rd,
              'latitude',         pt.latitude,
              'longitude',        pt.longitude,
              'herhalen',         pt.herhalen,
              'user_id',          pt.user_id,
              'datum',            pt.created_at,
              'organisatie_id',   pt.organisatie_id,
              'geometry_id',      pt.geometry_id,
              'geometry_type',     g.type,
              'geometry_omschrijving', g.omschrijving
            )
          )
          ORDER BY pt.created_at, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp
        ON ppp.plan_id = fp.id
      JOIN lis.points pt
        ON pt.id = ppp.point_id
      LEFT JOIN lis.geometries g
        ON g.id = pt.geometry_id
      WHERE fp.status = 'finished'
      ${shouldFilter ? `AND fp.regio_id = $1` : ``}
      GROUP BY fp.id;
    `;

    const params: any[] = shouldFilter ? [regio_id] : [];

    const result = await pool.query(sql, params);

    // Format plans: group points with geometry_id into geometries array
    const formattedPlans = result.rows.map((plan: any) => {
      const points = plan.points_data || [];
      const pointsWithoutGeometry: any[] = [];
      const geometriesMap = new Map<number, any>();

      // Separate points with and without geometry_id
      points.forEach((point: any) => {
        if (point.geometry_id) {
          const geometryId = point.geometry_id;
          
          if (!geometriesMap.has(geometryId)) {
            geometriesMap.set(geometryId, {
              id: geometryId,
              geometry_type: point.geometry_type || null,
              geometry_omschrijving: point.geometry_omschrijving || null,
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
        points_data: pointsWithoutGeometry,
        geometries: Array.from(geometriesMap.values()),
      };
    });

    res.status(200).json(formattedPlans);
  } catch (error: any) {
    console.error("❌ Error fetching finished flightplans:", error);
    res.status(500).json({
      message: "Failed to fetch finished flightplans",
      error: {
        name: error?.name,
        code: error?.code,
        hint: error?.hint,
        position: error?.position,
        detail: error?.detail,
        stack: error?.stack,
      },
    });
  }
}
