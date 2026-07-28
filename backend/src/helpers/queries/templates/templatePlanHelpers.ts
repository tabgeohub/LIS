import { Request, Response } from "express";
import { pool } from "../../../db";
import {
  loadFormattedTemplatePlans,
  respondTemplateListError,
} from "./fetchTemplateFlightPlanListHelpers";
import { selectTemplatePlanByName } from "../../repositories/templatePlansRepo";

export async function findTemplatePlanByName(name: string) {
  return selectTemplatePlanByName(pool, name);
}

export function respondTemplateNameTaken(res: Response): void {
  res.status(400).json({
    result: null,
    message: "Er bestaat al een sjabloon met deze naam.",
  });
}

export async function ensureTemplateNameAvailable(
  name: string,
  res: Response
): Promise<boolean> {
  const existingTemplate = await findTemplatePlanByName(name);
  if (existingTemplate.rows.length === 0) return true;
  respondTemplateNameTaken(res);
  return false;
}

export async function fetchTemplateFlightPlanList(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const formattedPlans = await loadFormattedTemplatePlans(req);
    res.status(200).json(formattedPlans);
  } catch (err) {
    respondTemplateListError(res, err);
  }
}
