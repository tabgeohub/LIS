/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { calculateCenterAndZoom } from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import useLogAction from "hooks/useLogAction";

export default function Buttons() {
  const { step, setStep, selectedPlan, setOpenFilter } =
    useFinishedPlansState();

  const logAction = useLogAction();

  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover, redGraphicsLayer, mapView } =
    useMapViewState();

  useEffect(() => {
    if (step === 1) {
      graphicsLayer?.removeAll();
      graphicsLayerHover?.removeAll();
    }
  }, [step]);

  function handleNext() {
    if (!mapView || !graphicsLayer || !selectedPlan) return;

    setStep(2);
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();

    const points = selectedPlan.points_data.sort((a, b) => a.order! - b.order!);

    let { center, zoom } = calculateCenterAndZoom(points);

    mapView.goTo({
      target: {
        geometry: {
          type: "point",
          x: center.longitude,
          y: center.latitude,
        },
      },
      zoom: zoom,
    });

    logAction({
      message: "User clicked 'Next' button",
      step: "First step",
    });
  }

  return (
    <>
      <button
        onClick={() => {
          setOpenFilter(true);
          logAction({
            message: "User clicked 'Filter' button",
            step: "First step",
          });
        }}
        className="gray-button"
      >
        Filteren
      </button>

      <button
        disabled={!selectedPlan}
        onClick={handleNext}
        className="gray-button"
      >
        Volgende
      </button>

      <button
        onClick={() => {
          graphicsLayer?.removeAll();
          graphicsLayerHover?.removeAll();
          redGraphicsLayer?.removeAll();

          setSelectedTab("none");

          logAction({
            message: "User clicked 'Cancel' button",
            step: "First step",
          });
        }}
        className="gray-button"
      >
        Annuleren
      </button>
    </>
  );
}
