import { useMemo, useState } from "react";
import { Geometry } from "hooks/features";
import { EnrichedPointType } from "Types";
import { useMatchingTemplateGeometries } from "./useMatchingTemplateGeometries";

export function useTemplateSelectionFilters(input: {
  repeat: boolean;
  filteredPoints: EnrichedPointType[];
}) {
  const matchingGeometries = useMatchingTemplateGeometries(input.repeat);
  const [filterText, setFilterText] = useState("");
  const normalizedFilter = filterText.toLowerCase();

  const displayedGeometries = useMemo(
    () =>
      matchingGeometries.filter((geometry: Geometry) =>
        geometry.omschrijving.toLowerCase().includes(normalizedFilter)
      ),
    [matchingGeometries, normalizedFilter]
  );

  const displayedPoints = useMemo(
    () =>
      input.filteredPoints.filter(
        (point) =>
          point.herhalen === (input.repeat ? 1 : 0) &&
          point.omschrijving.toLowerCase().includes(normalizedFilter)
      ),
    [input.filteredPoints, normalizedFilter, input.repeat]
  );

  return { filterText, setFilterText, displayedGeometries, displayedPoints };
}
