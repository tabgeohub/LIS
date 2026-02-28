import { Request, Response } from "express";
import { pool } from "../../db";

export async function getTemplateFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    const isAdmin = regio_id && regio_id.toString().toLowerCase() === "admin";
    const shouldFilter = regio_id && !isAdmin;

    const query = `
      SELECT
        tp.id AS id,
        tp.name,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', pt.id,
            'omschrijving', pt.omschrijving,
            'xcoordinaat_rd', pt.xcoordinaat_rd,
            'ycoordinaat_rd', pt.ycoordinaat_rd,
            'latitude', pt.latitude,
            'longitude', pt.longitude,
            'regio_id', pt.regio_id,
            'geometry_id', pt.geometry_id,
            'geometry_type', g.type,
            'geometry_omschrijving', g.omschrijving
          )
        ) AS points
      FROM lis.template_plans tp
      JOIN LATERAL UNNEST(tp.points) AS point_id ON TRUE
      JOIN lis.points pt ON pt.id = point_id
      LEFT JOIN lis.geometries g ON g.id = pt.geometry_id
      ${shouldFilter ? `WHERE tp.regio_id = $1` : ``}
      GROUP BY tp.id
      ORDER BY tp.id;
    `;

    const values = shouldFilter ? [regio_id] : [];

    const result = await pool.query(query, values);

    // Format plans: group points with geometry_id into geometries array
    // First, collect all unique geometry IDs from all templates
    const allGeometryIds = new Set<number>();
    result.rows.forEach((plan: any) => {
      (plan.points || []).forEach((point: any) => {
        if (point.geometry_id) {
          allGeometryIds.add(point.geometry_id);
        }
      });
    });

    // Fetch full geometry data (including all geometry points) for all geometries
    const geometryDataMap = new Map<number, any>();
    if (allGeometryIds.size > 0) {
      const geometryIdsArray = Array.from(allGeometryIds);
      const geometryQuery = `
        SELECT
          g.id,
          g.omschrijving,
          g.organisatie,
          g.vertrouwelijk,
          g.herhalen,
          g.activiteit,
          g.specifiek_letten_op,
          g.type,
          g.regio_id,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', p.id,
              'longitude', p.longitude,
              'latitude', p.latitude,
              'xcoordinaat_rd', p.xcoordinaat_rd,
              'ycoordinaat_rd', p.ycoordinaat_rd
            )
            ORDER BY p.id ASC
          ) AS points
        FROM lis.geometries g
        JOIN lis.points p ON p.geometry_id = g.id
        WHERE g.id = ANY($1)
        GROUP BY g.id
      `;
      const geometryResult = await pool.query(geometryQuery, [geometryIdsArray]);
      geometryResult.rows.forEach((geo: any) => {
        geometryDataMap.set(geo.id, geo);
      });
    }

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
            // Use full geometry data from geometries table if available
            const fullGeometryData = geometryDataMap.get(geometryId);
            if (fullGeometryData) {
              geometriesMap.set(geometryId, {
                id: geometryId,
                type: fullGeometryData.type,
                omschrijving: fullGeometryData.omschrijving,
                organisatie: fullGeometryData.organisatie,
                vertrouwelijk: fullGeometryData.vertrouwelijk,
                herhalen: fullGeometryData.herhalen,
                activiteit: fullGeometryData.activiteit,
                specifiek_letten_op: fullGeometryData.specifiek_letten_op,
                regio_id: fullGeometryData.regio_id,
                points: fullGeometryData.points || [],
              });
            } else {
              // Fallback to point data if geometry not found
              geometriesMap.set(geometryId, {
                id: geometryId,
                type: point.geometry_type || null,
                omschrijving: point.geometry_omschrijving || null,
                points: [],
              });
            }
          }
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
      "Error fetching template flight plans:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to fetch template flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
