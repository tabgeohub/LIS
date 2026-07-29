import { useEffect, useState } from "react";
import { matchesGeometryRepeat } from "@helpers/geometry/matchesGeometryRepeat";
import { Geometry, useGeometriesStore } from "hooks/features";

export function useMatchingTemplateGeometries(repeat: boolean) {
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const [matchingGeometries, setMatchingGeometries] = useState<Geometry[]>([]);

  useEffect(() => {
    const matches = dbGeometries.filter((geometry) =>
      matchesGeometryRepeat(geometry, repeat)
    );
    setGeometries(matches);
    setMatchingGeometries(matches);
  }, [dbGeometries, repeat, setGeometries]);

  return matchingGeometries;
}
