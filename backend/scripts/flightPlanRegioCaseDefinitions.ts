import { buildFlightPlanQuery } from "../src/helpers/queries/flight-plans/buildFlightPlanQuery";
import {
  buildFinishedFlightPlansListQuery,
  buildFinishedPlansTimeRangeQuery,
  buildFinishedPlansWithPointsQuery,
} from "../src/helpers/queries/finished-plans/buildFinishedPlanQuery";
import { TEMPLATE_PLANS_TABLE } from "../src/helpers/repositories/flightPlanSelectSql";

export type FlightPlanCase = {
  name: string;
  build: (regio: string | undefined) => { query: string; params: unknown[] };
};

export const FLIGHT_PLAN_REGIO_CASES: FlightPlanCase[] = [
  { name: "GET /flightPlans", build: (regio) => buildFlightPlanQuery({ columnPreset: "all", pointPreset: "full", includeGeometryJoin: true, where: "fp.status <> 'inactief'", regio_id: regio, regioFilter: { caseInsensitiveAdmin: true } }) },
  { name: "GET /flightPlans/prepreparedFlightPlans", build: (regio) => buildFlightPlanQuery({ columnPreset: "search", pointPreset: "search", where: "fp.status = 'pre-prepared'", regio_id: regio, regioFilter: { caseInsensitiveAdmin: true } }) },
  { name: "GET /flightPlans/fullPreparedFlightPlans", build: (regio) => buildFlightPlanQuery({ columnPreset: "prepared", pointPreset: "minimal", where: "fp.status = 'prepared'", regio_id: regio, regioFilter: { caseInsensitiveAdmin: true } }) },
  { name: "GET /flightPlans/unPreparedPlans", build: (regio) => buildFlightPlanQuery({ columnPreset: "minimal", pointPreset: "minimal", where: "fp.status = 'pre-prepared'", regio_id: regio, regioFilter: { caseInsensitiveAdmin: true } }) },
  { name: "GET /templateFlight", build: (regio) => buildFlightPlanQuery({ planTable: TEMPLATE_PLANS_TABLE, planAlias: "tp", columnPreset: "template", pointPreset: "template", includeGeometryJoin: true, regio_id: regio, regioColumn: "tp.regio_id", regioFilter: { caseInsensitiveAdmin: true } }) },
  { name: "GET /finished_plans/getPartialFinishedFlightPlans", build: (regio) => buildFinishedPlansWithPointsQuery({ regio_id: regio }) },
  { name: "GET /finished_plans/", build: (regio) => buildFinishedFlightPlansListQuery(regio) },
  { name: "GET /timeslider/getTimeRange", build: (regio) => buildFinishedPlansTimeRangeQuery(regio) },
];
