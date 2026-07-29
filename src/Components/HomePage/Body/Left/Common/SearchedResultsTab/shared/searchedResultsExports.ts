import { EnrichedPointType, FlightPlanType } from "Types";
import {
  downloadCsvFromRows,
  downloadEnrichedPointsShapefile,
  downloadXlsxFromRows,
  exportFlightPlansShapefile,
} from "Components/HomePage/helpers/tableExports/pointsPlansTableExport";

export function exportSearchedPointsCsv(points: EnrichedPointType[]) {
  downloadCsvFromRows({ rows: points, filename: "points_export.csv" });
}

export function exportSearchedPointsXlsx(points: EnrichedPointType[]) {
  downloadXlsxFromRows({
    rows: points,
    filename: "points_export.xlsx",
    sheetName: "Points",
  });
}

export function exportSearchedPointsShp(points: EnrichedPointType[]) {
  downloadEnrichedPointsShapefile(points);
}

export function exportSearchedFlightPlansCsv(plans: FlightPlanType[]) {
  downloadCsvFromRows({
    rows: plans,
    filename: "plans_export.csv",
    excludeKeys: ["points"],
  });
}

export function exportSearchedFlightPlansXlsx(plans: FlightPlanType[]) {
  const cleanedPlans = plans.map(({ points, ...rest }) => rest);
  downloadXlsxFromRows({
    rows: cleanedPlans,
    filename: "exports_xlsx.xlsx",
    sheetName: "FlightPlans",
  });
}

export async function exportSearchedFlightPlansShp(plans: FlightPlanType[]) {
  await exportFlightPlansShapefile(plans);
}

type LogAction = (input: { message: string; step: string }) => void;

/** Export handlers for GroupFunctions (points or plans by `target`). */
export function createSearchedResultsExportHandlers(input: {
  target: string;
  pointsData: EnrichedPointType[];
  flightPlansData: FlightPlanType[];
  logAction: LogAction;
}) {
  const step = `Searched results - ${input.target} drop down`;

  const log = (message: string) => {
    input.logAction({ message, step });
  };

  return {
    exportCsv: () => {
      if (input.target === "points") {
        exportSearchedPointsCsv(input.pointsData);
        log("User exported points to CSV");
        return;
      }
      exportSearchedFlightPlansCsv(input.flightPlansData);
      log("User exported flight plans to CSV");
    },
    exportXlsx: () => {
      if (input.target === "points") {
        exportSearchedPointsXlsx(input.pointsData);
        log("User exported points to XLSX");
        return;
      }
      exportSearchedFlightPlansXlsx(input.flightPlansData);
      log("User exported flight plans to XLSX");
    },
    exportShp: async () => {
      if (input.target === "points") {
        exportSearchedPointsShp(input.pointsData);
        log("User exported flight plans to shapefile");
        return;
      }
      await exportSearchedFlightPlansShp(input.flightPlansData);
      log("User exported flight plans to shapefile");
    },
  };
}
