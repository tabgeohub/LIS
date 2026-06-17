import { Request, Response } from "express";
import { fetchConstLookup } from "../../helpers/queries/fetchConstLookup";

export async function getRegios(req: Request, res: Response): Promise<void> {
  await fetchConstLookup(req, res, {
    select: "id, naam, shape_area, shape_length",
    from: "lis.regios",
    errorLabel: "regios",
    useErrorField: true,
  });
}
