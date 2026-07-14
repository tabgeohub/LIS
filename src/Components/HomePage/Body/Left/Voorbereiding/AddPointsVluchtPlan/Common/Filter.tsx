import PointGeometryFilterPanel from "../../../Common/PointGeometryFilterPanel";
import type { EnrichedPointType } from "Types";

export default function Filter({
  setOpenFilter,
  setFilteredPoints,
  herhalen,
}: {
  setOpenFilter: (value: boolean) => void;
  setFilteredPoints: (value: EnrichedPointType[]) => void;
  herhalen: boolean;
}) {
  return (
    <PointGeometryFilterPanel
      setOpenFilter={setOpenFilter}
      setFilteredPoints={setFilteredPoints}
      herhalen={herhalen}
      labels={{
        activity: "Activiteit",
        all: "Alle",
        lastFourWeeks: "Laatste 4 weken",
        customPeriod: "Periodoe van-tot",
        dateFrom: "Periode van",
        dateTo: "Periode tot",
        apply: "Filter",
        cancel: "Annuleren",
      }}
    />
  );
}
