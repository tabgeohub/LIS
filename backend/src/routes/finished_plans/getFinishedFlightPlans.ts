import { Request, Response } from "express";

import { pool } from "../../db";

import { buildFinishedFlightPlansListQuery } from "../../helpers/queries/finished-plans/buildFinishedPlanQuery";

import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";



export async function getFinishedFlightPlans(

  req: Request,

  res: Response

): Promise<void> {

  try {

    const regio_id = resolveRegioFilter(req);

    const { query, params } = buildFinishedFlightPlansListQuery(regio_id);



    const result = await pool.query(query, params);



    res.status(200).json(result.rows);

  } catch (error) {

    console.error("❌ Error fetching finished flightplans:", error);

    res.status(500).json({ message: "Failed to fetch finished flightplans" });

  }

}

