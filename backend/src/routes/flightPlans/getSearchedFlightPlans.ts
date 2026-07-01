import { Request, Response } from "express";
import { fetchFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";

export async function getSearchedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  const search = req.query.search as string;

  if (!search) {
    res.status(400).json({ message: "Missing search query parameter" });
    return;
  }

  await fetchFlightPlanList({
    req,
    res,
    columnPreset: "search",
    pointPreset: "search",
    where:
      "LOWER(fp.vluchtnummer) LIKE LOWER($1) OR LOWER(fp.omschrijving) LIKE LOWER($1)",
    params: [`%${search}%`],
    errorMessage: "Failed to fetch flight plans",
  });
}
