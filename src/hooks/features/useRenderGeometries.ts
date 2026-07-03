/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { useGeometriesStore } from "./useGeometriesStore";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { buildGeometryMapGraphics } from "./geometryMapGraphics";

function shouldSkipDefaultGeometryRender(input: {
  step: number;
  flightPlanStep: number;
  geometriesCount: number;
}) {
  if (input.geometriesCount === 0) return true;
  if (input.step === 2) return true;
  return input.flightPlanStep === 3 || input.flightPlanStep === 4;
}

export function useRenderGeometries() {
  const { user } = useAuth();
  const { map, geometriesGraphicsLayer } = useMapViewState();
  const { geometries, fetchGeometries } = useGeometriesStore();
  const { selectedPage } = useTabState();
  const timesliderPlans = useTimesliderState((s) => s.plans);
  const { step } = useFinishedPlansState();
  const { step: flightPlanStep } = useFlightPlanState();

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user.user_id, user.role]);

  useEffect(() => {
    if (!validateMapView(map, geometriesGraphicsLayer) || !geometries) return;
    if (user.user_id === undefined || user.user_id === 0) return;

    if (selectedPage === "timeslider") {
      if (timesliderPlans.length === 0) {
        geometriesGraphicsLayer?.removeAll();
        return;
      }

      const { geometryIds } = getPointAndGeometryIdsFromPlans(timesliderPlans);
      const filtered = geometries.filter((g) => geometryIds.has(g.id));
      replaceGraphics(
        geometriesGraphicsLayer,
        buildGeometryMapGraphics(filtered)
      );
      return () => geometriesGraphicsLayer?.removeAll();
    }

    if (shouldSkipDefaultGeometryRender({
      step,
      flightPlanStep,
      geometriesCount: geometries.length,
    })) {
      return;
    }

    replaceGraphics(
      geometriesGraphicsLayer,
      buildGeometryMapGraphics(geometries)
    );

    return () => geometriesGraphicsLayer?.removeAll();
  }, [
    map,
    geometriesGraphicsLayer,
    geometries,
    user.user_id,
    selectedPage,
    timesliderPlans,
    step,
    flightPlanStep,
  ]);
}
