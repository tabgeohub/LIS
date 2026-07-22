import type { EnrichedPointType } from "Types";

type Option = { label: string; value: string };

export type BuildSelectedPointDetailsInput = {
  point: EnrichedPointType;
  activities: Option[];
  organizations: Option[];
};

function yesNo(flag: number | undefined): string {
  return flag === 1 ? "Ja" : "Nee";
}

function optionLabel(options: Option[], value: string | undefined): string {
  return options.find((item) => item.value === value)?.label || "";
}

export function buildSelectedPointDetails({
  point,
  activities,
  organizations,
}: BuildSelectedPointDetailsInput) {
  return [
    { label: "Omschrijving", value: point?.omschrijving },
    { label: "Regio", value: point?.regio_id },
    { label: "X-coordinaat", value: point?.xcoordinaat_rd },
    { label: "Y-coordinaat", value: point?.ycoordinaat_rd },
    { label: "Latitude", value: point?.latitude },
    { label: "Longitude", value: point?.longitude },
    { label: "Herhalen", value: yesNo(point?.herhalen) },
    { label: "Vertrouwelijk", value: yesNo(point?.vertrouwelijk) },
    { label: "Indiener", value: point?.user_id },
    {
      label: "Activiteit",
      value: optionLabel(activities, point?.activiteit_id),
    },
    {
      label: "Organisatie",
      value: optionLabel(organizations, point?.organisatie_id),
    },
    { label: "Specifiek letten op", value: point?.specifiek_letten_op },
    { label: "Datum", value: point.datum },
  ];
}
