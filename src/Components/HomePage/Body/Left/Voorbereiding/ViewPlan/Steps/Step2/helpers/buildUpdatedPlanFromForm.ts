import { Geometry } from "hooks/features/useGeometriesStore";
import { EnrichedPointType, FlightPlanType } from "Types";

export type ViewPlanFormFields = {
  vluchtnummer: string;
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  geplandeVliegduur: string;
  typeLuchtvaartuig: string;
  aantalPassagiers: number;
  doelEnHoofdthema: string;
  aanvullendeInfo: string;
};

/** All point IDs to persist: standalone (table) + geometry vertices. */
export function collectPointIdsFromTables(
  pointsTable: EnrichedPointType[],
  geometriesTable: Geometry[]
): number[] {
  const fromPoints = pointsTable.map((p) => p.id);
  const fromGeometries = geometriesTable.flatMap((g) =>
    g.points.map((p) => p.id)
  );

  return Array.from(new Set([...fromPoints, ...fromGeometries]));
}

export function buildUpdatedPlanFromForm(
  selectedPlan: FlightPlanType,
  form: ViewPlanFormFields,
  pointsTable: EnrichedPointType[],
  geometriesTable: Geometry[]
): FlightPlanType {
  return {
    ...selectedPlan,
    vluchtnummer: form.vluchtnummer,
    omschrijving: form.omschrijving,
    waarnemer: form.waarnemer,
    piloot: form.piloot,
    datum: form.datum,
    vliegduur: form.geplandeVliegduur,
    geplandeVliegduur: form.geplandeVliegduur,
    luchtvaartuig: form.typeLuchtvaartuig,
    typeLuchtvaartuig: form.typeLuchtvaartuig,
    passagiers: form.aantalPassagiers,
    hoofdthema: form.doelEnHoofdthema,
    aanvullende: form.aanvullendeInfo,
    points: pointsTable,
    pointsObjects: pointsTable,
    geometries: geometriesTable,
  };
}

export function buildViewPlanUpdatePayload(
  selectedPlan: FlightPlanType,
  form: ViewPlanFormFields,
  pointsTable: EnrichedPointType[],
  geometriesTable: Geometry[],
  userId: number
) {
  return {
    vluchtnummer: form.vluchtnummer,
    omschrijving: form.omschrijving,
    waarnemer: form.waarnemer,
    piloot: form.piloot,
    datum: form.datum,
    vliegduur: form.geplandeVliegduur,
    luchtvaartuig: form.typeLuchtvaartuig,
    passagiers: form.aantalPassagiers,
    hoofdthema: form.doelEnHoofdthema,
    aanvullende: form.aanvullendeInfo,
    points: collectPointIdsFromTables(pointsTable, geometriesTable),
    id: selectedPlan.id,
    status: selectedPlan.status,
    user_id: userId,
  };
}

export function replacePlanInList(
  plans: FlightPlanType[],
  updated: FlightPlanType
): FlightPlanType[] {
  return plans.map((p) => (p.id === updated.id ? updated : p));
}
