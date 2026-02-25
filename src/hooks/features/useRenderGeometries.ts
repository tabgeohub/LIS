/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useGeometriesStore, Geometry } from "./useGeometriesStore";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFlightPlanState } from "Components/HomePage/Body/Left/Voorbereiding/FlightPlan/helpers/flightPlanStates";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";

export function useRenderGeometries() {
  const { user } = useAuth();
  const { map, geometriesGraphicsLayer } = useMapViewState();
  const { geometries, fetchGeometries } = useGeometriesStore();
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
    if (!map || !geometriesGraphicsLayer || !geometries || geometries.length === 0) return;
    if (user.user_id === undefined || user.user_id === 0) return;
    // Skip rendering when in Step2 - useRenderPlanGeometries handles rendering plan geometries
    if (step === 2) return;
    // Skip rendering when in FlightPlan Step2 or Step3 - GeometriesList handles rendering
    if (flightPlanStep === 3 || flightPlanStep === 4) return;

    // Clear existing geometry graphics
    geometriesGraphicsLayer.removeAll();

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
      .filter((graphic): graphic is NonNullable<typeof graphic> => graphic !== null);

    // Add all geometry graphics to the layer
    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    // Cleanup: remove geometry graphics when component unmounts or geometries change
    return () => {
      if (geometriesGraphicsLayer) {
        geometriesGraphicsLayer.removeAll();
      }
    };
  }, [map, geometriesGraphicsLayer, geometries, user.user_id, step, flightPlanStep]);
}

