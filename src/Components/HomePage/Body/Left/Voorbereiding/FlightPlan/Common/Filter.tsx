import PointGeometryFilterPanel from "../../../Common/PointGeometryFilterPanel";
import { useContent } from "hooks/useContent";
import type { Geometry } from "hooks/features/useGeometriesStore";
import type { EnrichedPointType } from "Types";

export default function Filter({
  setOpenFilter,
  herhalen,
  setFilteredPoints,
  setFilteredGeometries,
}: {
  setOpenFilter: (value: boolean) => void;
  herhalen: boolean;
  setFilteredPoints: (value: EnrichedPointType[]) => void;
  setFilteredGeometries?: (value: Geometry[]) => void;
}) {
  const content = useContent();
  const labels = content.common.filterSection;

  return (
    <PointGeometryFilterPanel
      setOpenFilter={setOpenFilter}
      setFilteredPoints={setFilteredPoints}
      setFilteredGeometries={setFilteredGeometries}
      herhalen={herhalen}
      closeBeforeFilter
      labels={{
        activity: labels.activiteit,
        all: labels.Alle,
        lastFourWeeks: labels.Laatste4weken,
        customPeriod: labels.PeriodeVanTot,
        dateFrom: labels.Periodevan,
        dateTo: labels.Periodetot,
        apply: content.common.filteren,
        cancel: content.common.annuleren,
      }}
    />
  );
}
