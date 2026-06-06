/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { useGeometriesStore, Geometry } from "./useGeometriesStore";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";

export function useRenderGeometries() {
  const { user } = useAuth();
  const { map, geometriesGraphicsLayer } = useMapViewState();
  const { geometries, fetchGeometries } = useGeometriesStore();
  const { selectedPage } = useTabState();
  const timesliderPlans = useTimesliderState((s) => s.plans);
  const { step } = useFinishedPlansState();
  const { step: flightPlanStep } = useFlightPlanState();

  // Fetch geometries
  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;

    // Only fetch once - fetchGeometries now populates both geometries and dbGeometries
    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user.user_id, user.role]);

  // Render geometries on the map
  useEffect(() => {
    if (!validateMapView(map, geometriesGraphicsLayer) || !geometries) return;
    if (user.user_id === undefined || user.user_id === 0) return;

    // Timeslider page: only geometries that belong to the current flight plan list
    if (selectedPage === "timeslider") {
      if (timesliderPlans.length === 0) {
        geometriesGraphicsLayer?.removeAll();
        return;
      }
      const { geometryIds } = getPointAndGeometryIdsFromPlans(timesliderPlans);
      const filtered = geometries.filter((g) => geometryIds.has(g.id));
      const graphicsTs = filtered
        .map((geometry) => {
          return createGeometryGraphic(geometry, {
            attributes: {
              organisatie: geometry.organisatie,
              vertrouwelijk: geometry.vertrouwelijk,
              herhalen: geometry.herhalen,
              activiteit: geometry.activiteit,
              specifiek_letten_op: geometry.specifiek_letten_op,
              regio_id: geometry.regio_id,
            },
          });
        })
        .filter(
          (graphic): graphic is NonNullable<typeof graphic> => graphic !== null
        );
      replaceGraphics(geometriesGraphicsLayer, graphicsTs);
      return () => {
        if (geometriesGraphicsLayer) {
          geometriesGraphicsLayer.removeAll();
        }
      };
    }

    if (geometries.length === 0) return;
    // Skip rendering when in Step2 - useRenderPlanGeometries handles rendering plan geometries
    if (step === 2) return;
    // Skip rendering when in FlightPlan Step2 or Step3 - GeometriesList handles rendering
    if (flightPlanStep === 3 || flightPlanStep === 4) return;

    // Create graphics with additional attributes
    const graphics = geometries
      .map((geometry) => {
        return createGeometryGraphic(geometry, {
          attributes: {
            // Include all geometry properties as attributes
            organisatie: geometry.organisatie,
            vertrouwelijk: geometry.vertrouwelijk,
            herhalen: geometry.herhalen,
            activiteit: geometry.activiteit,
            specifiek_letten_op: geometry.specifiek_letten_op,
            regio_id: geometry.regio_id,
          },
        });
      })
      .filter(
        (graphic): graphic is NonNullable<typeof graphic> => graphic !== null
      );

    replaceGraphics(geometriesGraphicsLayer, graphics);

    // Cleanup: remove geometry graphics when component unmounts or geometries change
    return () => {
      if (geometriesGraphicsLayer) {
        geometriesGraphicsLayer.removeAll();
      }
    };
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
