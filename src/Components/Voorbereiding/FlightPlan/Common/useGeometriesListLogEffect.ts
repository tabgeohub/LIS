import { useEffect } from "react";
import useLogAction from "hooks/useLogAction";
import { Geometry } from "hooks/features";
import { getHerhalenFilterFromGeometries } from "./geometryHerhalen";

export function useGeometriesListLogEffect(
  geometries: Geometry[],
  safeSelectedGeometries: number[]
) {
  const logAction = useLogAction();
  const herhalenFilter = getHerhalenFilterFromGeometries(geometries);

  useEffect(() => {
    logAction({
      message: "User is selecting geometries",
      step: `Step ${herhalenFilter ? 2 : 3}`,
      newData: { selectedGeometries: safeSelectedGeometries },
    });
  }, [safeSelectedGeometries, herhalenFilter, logAction]);
}
