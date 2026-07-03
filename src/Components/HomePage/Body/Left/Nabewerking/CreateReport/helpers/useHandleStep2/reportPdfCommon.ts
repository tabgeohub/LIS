import { PDFPointDataType } from "Types";
import { FinishedFlightPlanType, FinishedPointType } from "Types/finished_plans";
import { getStaticMapImage } from "./mapImage";
import { safeFetchPointAttachments } from "./attachments";
import type { AttachmentWithMeta } from "./types";

export function lookupLabel(
  options: Array<{ label: string; value: string | number }>,
  value: string | number | undefined
): string {
  return options.find((option) => option.value === value)?.label || "";
}

export function buildPdfPointData(input: {
  selectedPlan: FinishedFlightPlanType;
  point: FinishedPointType;
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
  omschrijving: string;
  aanvullende: string | number;
  longitude: number;
  latitude: number;
}): PDFPointDataType {
  const { selectedPlan, point, activities, organizations } = input;
  return {
    datum: selectedPlan.datum,
    piloot: selectedPlan.piloot,
    waarnemer: selectedPlan.waarnemer,
    luchtvaartuig: selectedPlan.luchtvaartuig,
    hoofdthema: selectedPlan.hoofdthema,
    organisatie: lookupLabel(organizations, point.organisatie_id),
    activiteit: lookupLabel(activities, point.activiteit_id),
    regio: point.regio_id,
    omschrijving: input.omschrijving,
    aanvullende: input.aanvullende,
    rdX: point.xcoordinaat_rd,
    rdY: point.ycoordinaat_rd,
    long: input.longitude,
    lat: input.latitude,
  };
}

export function toSafeReportName(value: string): string {
  return value.replace(/[^\w\s\-]/g, "_").replace(/\s+/g, "_");
}

export async function fetchOverviewDetailImages(input: {
  longitude: number;
  latitude: number;
  mapServerUrl: string;
}) {
  return Promise.all([
    getStaticMapImage(
      input.longitude,
      input.latitude,
      10,
      1600,
      900,
      input.mapServerUrl
    ),
    getStaticMapImage(
      input.longitude,
      input.latitude,
      17,
      1600,
      900,
      input.mapServerUrl
    ),
  ]);
}

export async function resolveReportAttachments(input: {
  cached: AttachmentWithMeta[] | undefined;
  featureLayerUrl: string;
  point: FinishedPointType;
}): Promise<AttachmentWithMeta[]> {
  if (input.cached?.length) return input.cached;
  if (!input.point.attachments?.length) return [];

  try {
    return await safeFetchPointAttachments(input.featureLayerUrl, input.point);
  } catch {
    return [];
  }
}
