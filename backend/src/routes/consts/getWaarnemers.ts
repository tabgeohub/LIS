import { Request, Response } from "express";
import { fetchConstLookup } from "../../helpers/queries/consts/fetchConstLookup";

export async function getWaarnemers(
  req: Request,
  res: Response
): Promise<void> {
  await fetchConstLookup(req, res, {
    select: "id, naam, regio_id",
    from: "lis.waarnemers",
    errorLabel: "piloten",
  });
}
