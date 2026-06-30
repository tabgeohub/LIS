import { Request, Response } from "express";
import { fetchConstLookup } from "../../helpers/queries/consts/fetchConstLookup";

export async function getActiviteiten(
  req: Request,
  res: Response
): Promise<void> {
  await fetchConstLookup(req, res, {
    select: "id, activiteit",
    from: "lis.activiteiten",
    orderBy: "activiteit ASC",
    errorLabel: "activiteiten",
  });
}
