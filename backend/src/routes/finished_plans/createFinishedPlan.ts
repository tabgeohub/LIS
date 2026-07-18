import { Request, Response } from "express";
import {
  finishedPlanFail,
  validateFinishedPlan,
} from "../../helpers/validators/finishedPlan";
import {
  connectFinishedPlanClient,
  saveFinishedPlanWithClient,
} from "./createFinishedPlanHelpers";

export async function createFinishedPlan(
  req: Request,
  res: Response
): Promise<void> {
  const validated = validateFinishedPlan(req.body);
  if (!validated.ok) {
    finishedPlanFail({
      res,
      status: 400,
      code: "ERR_VALIDATION",
      message: validated.reason,
    });
    return;
  }

  const client = await connectFinishedPlanClient(res);
  if (!client) {
    return;
  }

  await saveFinishedPlanWithClient({
    client,
    res,
    plan: validated.plan,
  });
}
