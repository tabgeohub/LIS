import { FlightPlanType } from "Types";

export type SelectFromSourceItemPoint = {
  id: number;
  omschrijving: string;
  longitude?: number;
  latitude?: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
};

export type SelectFromSourceItem = {
  id: number;
  title: string;
  points: SelectFromSourceItemPoint[];
};

type TemplatePoint = { id: number; omschrijving: string };
type Template = { id: number; name: string; points: TemplatePoint[] };

function mapFlightPlanPoints(
  plan: FlightPlanType
): SelectFromSourceItemPoint[] {
  const rawPoints = plan.pointsObjects?.length ? plan.pointsObjects : plan.points;
  return (rawPoints ?? []).map((pt) => ({
    id: pt.id,
    omschrijving: pt.omschrijving,
    longitude: pt.longitude,
    latitude: pt.latitude,
    xcoordinaat_rd: pt.xcoordinaat_rd,
    ycoordinaat_rd: pt.ycoordinaat_rd,
  }));
}

function mapTemplatePoints(template: Template): SelectFromSourceItemPoint[] {
  return (template.points ?? []).map((pt) => ({
    id: pt.id,
    omschrijving: pt.omschrijving,
    xcoordinaat_rd: (pt as { xcoordinaat_rd?: number }).xcoordinaat_rd,
    ycoordinaat_rd: (pt as { ycoordinaat_rd?: number }).ycoordinaat_rd,
    longitude: (pt as { longitude?: number }).longitude,
    latitude: (pt as { latitude?: number }).latitude,
  }));
}

export function mapSourceToItems(options: {
  source: "flightPlans" | "templates";
  data: FlightPlanType[] | Template[] | undefined;
}): SelectFromSourceItem[] {
  if (!options.data) return [];

  if (options.source === "flightPlans") {
    return (options.data as FlightPlanType[]).map((plan) => ({
      id: plan.id,
      title: plan.vluchtnummer,
      points: mapFlightPlanPoints(plan),
    }));
  }

  return (options.data as Template[]).map((template) => ({
    id: template.id,
    title: template.name,
    points: mapTemplatePoints(template),
  }));
}

export function filterPointsNotInPlan(
  points: SelectFromSourceItemPoint[],
  planPointIds: Set<number>
): SelectFromSourceItemPoint[] {
  return points.filter((pt) => !planPointIds.has(pt.id));
}

export function buildPlanPointIdSet(
  planPoints: { id: number }[] | undefined
): Set<number> {
  return new Set((planPoints ?? []).map((p) => p.id));
}
