import { Request, Response } from "express";
import { fetchConstLookup } from "../../helpers/queries/fetchConstLookup";

export async function getOrganisaties(
  req: Request,
  res: Response
): Promise<void> {
  await fetchConstLookup(req, res, {
    select: "id, naam",
    from: "lis.organisaties",
    orderBy: "naam ASC",
    errorLabel: "organisaties",
  });
}
