import { FinishedFlightPlanType } from "Types/finished_plans";

export function createReportPlanClickLogData(plan: FinishedFlightPlanType) {
  return {
    vluchtnummer: plan.vluchtnummer,
    omschrijving: plan.omschrijving,
    waarnemer: plan.waarnemer,
    piloot: plan.piloot,
    datum: plan.datum,
    vliegduur: plan.vliegduur,
    luchtvaartuig: plan.luchtvaartuig,
    passagiers: plan.passagiers,
    hoofdthema: plan.hoofdthema,
    aanvullende: plan.aanvullende,
  };
}
