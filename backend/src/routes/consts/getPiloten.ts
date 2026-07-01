import { Request, Response } from "express";
import { fetchConstLookup } from "../../helpers/queries/consts/fetchConstLookup";

export async function getPiloten(_req: Request, res: Response): Promise<void> {
  await fetchConstLookup({
    res,
    select: "id, naam",
    from: "lis.piloten",
    where: "status = 'active'",
    orderBy: "naam ASC",
    errorLabel: "piloten",
  });
}
