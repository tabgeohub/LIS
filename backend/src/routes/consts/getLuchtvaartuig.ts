import { Request, Response } from "express";
import { fetchConstLookup } from "../../helpers/queries/consts/fetchConstLookup";

export async function getLuchtvaartuig(
  req: Request,
  res: Response
): Promise<void> {
  await fetchConstLookup(req, res, {
    select: "id, naam",
    from: "lis.luchtvaartuig",
    errorLabel: "piloten",
  });
}
