/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect, useState } from "react";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { findSpecificPoint } from "../../../EnrichedAddPoint/helpers/findSpecificPoint";
import { createNewPointEvent } from "@helpers/ArcGISHelpers/createNewPointEvent";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";

export default function AddPointStep() {
  const [addPointStep, setAddPointStep] = useState(1);

  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setSelectedTab } = useTabState();

  const { graphicsLayer, graphicsLayerHover } = useMapViewState();

  const { setOpenTable } = useOpenTable();

  const {
    currentPoint,
    xCoord,
    yCoord,
    setCoordinateSystem,
    setLatitude,
    setLongitude,
    setXCoord,
    setYCoord,
    setVertrouwelijk,
    setHerhalen,
    setOmschrijving,
    setActiviteit,
    setOrganisatie,
    setSpecifiekLettenOp,
    setCurrentPoint,
    setMapClickedNotify,
    mapClickedNotify,
  } = useEnrichedPointState();

  const { setOpenFilter } = useViewPlanState();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((addPointStep === 2 || addPointStep === 1) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        if (!event.mapPoint.longitude || !event.mapPoint.latitude) return;

        setMapClickedNotify(mapClickedNotify + 1);

        setCurrentPoint({
          x: event.mapPoint.longitude,
          y: event.mapPoint.latitude,
        });

        createNewPointEvent(
          event,
          redGraphicsLayer,
          setXCoord,
          setYCoord,
          setLatitude,
          setLongitude,
          setCurrentPoint
        );
        if (addPointStep === 1) {
          setAddPointStep(3);
        }
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [
    mapView,
    addPointStep,
    currentPoint,
    setXCoord,
    setYCoord,
    mapClickedNotify,
  ]);

  function handleCancel() {
    if (currentPoint.x !== 0 && currentPoint.y !== 0) {
      const currentGraphicToRemove = findSpecificPoint(
        mapView,
        currentPoint.x,
        currentPoint.y
      );

      if (currentGraphicToRemove) {
        mapView?.graphics.remove(currentGraphicToRemove);
      }
    }

    const graphicToRemove = findSpecificPoint(mapView, xCoord, yCoord);

    if (graphicToRemove) {
      mapView?.graphics.remove(graphicToRemove);
    }

    setSelectedTab("none");

    resetFormAndState();
  }

  function resetFormAndState() {
    setOpenTable(false);
    setOpenFilter(false);
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    setAddPointStep(1);
    setXCoord(0);
    setYCoord(0);
    setLatitude(0);
    setLongitude(0);
    setCoordinateSystem("RD");
    setVertrouwelijk(false);
    setHerhalen(false);
    setOmschrijving("");
    setActiviteit("");
    setOrganisatie("");
    setSpecifiekLettenOp("");
    setCurrentPoint({ x: 0, y: 0 });
  }
  return (
    <div className="mt-4 px-2 h-full">
      {addPointStep === 1 && (
        <Step1 handleCancel={handleCancel} setAddPointStep={setAddPointStep} />
      )}

      {addPointStep === 2 && (
        <Step2 handleCancel={handleCancel} setAddPointStep={setAddPointStep} />
      )}

      {addPointStep === 3 && (
        <Step3
          handleCancel={handleCancel}
          resetFormAndState={resetFormAndState}
          setStepAdd={setAddPointStep}
        />
      )}
    </div>
  );
}
