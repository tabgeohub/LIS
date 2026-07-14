import type { EnrichedPointType } from "Types";

type Option = { label: string; value: string };

export function buildSelectedPointDetails(
  point: EnrichedPointType,
  activities: Option[],
  organizations: Option[]
) {
  return [
    { label: "Omschrijving", value: point?.omschrijving },
    { label: "Regio", value: point?.regio_id },
    { label: "X-coordinaat", value: point?.xcoordinaat_rd },
    { label: "Y-coordinaat", value: point?.ycoordinaat_rd },
    { label: "Latitude", value: point?.latitude },
    { label: "Longitude", value: point?.longitude },
    { label: "Herhalen", value: point?.herhalen === 1 ? "Ja" : "Nee" },
    { label: "Vertrouwelijk", value: point?.vertrouwelijk === 1 ? "Ja" : "Nee" },
    { label: "Indiener", value: point?.user_id },
    { label: "Activiteit", value: activities.find((item) => item.value === point?.activiteit_id)?.label || "" },
    { label: "Organisatie", value: organizations.find((item) => item.value === point?.organisatie_id)?.label || "" },
    { label: "Specifiek letten op", value: point?.specifiek_letten_op },
    { label: "Datum", value: point.datum },
  ];
}
