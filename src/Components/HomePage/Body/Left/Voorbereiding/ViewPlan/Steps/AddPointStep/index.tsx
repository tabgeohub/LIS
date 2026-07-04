import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useState } from "react";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useAddPointStepMapClick } from "./useAddPointStepMapClick";
import {
  removeAddPointMapGraphics,
  resetAddPointFormState,
} from "./resetAddPointStepState";

export default function AddPointStep() {
  const [addPointStep, setAddPointStep] = useState(1);

  const { mapView, redGraphicsLayer, graphicsLayer, graphicsLayerHover } =
    useMapViewState();
  const { setSelectedTab } = useTabState();
  const { setOpenTable } = useOpenTable();
  const { setOpenFilter } = useViewPlanState();

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

  useAddPointStepMapClick({
    addPointStep,
    mapClickedNotify,
    setMapClickedNotify,
    setCurrentPoint,
    setXCoord,
    setYCoord,
    setLatitude,
    setLongitude,
    setAddPointStep,
  });

  function handleCancel() {
    removeAddPointMapGraphics({ mapView, currentPoint, xCoord, yCoord });
    setSelectedTab("none");
    resetFormAndState();
  }

  function resetFormAndState() {
    resetAddPointFormState({
      graphicsLayer,
      graphicsLayerHover,
      setOpenTable,
      setOpenFilter,
      setAddPointStep,
      setXCoord,
      setYCoord,
      setLatitude,
      setLongitude,
      setCoordinateSystem,
      setVertrouwelijk,
      setHerhalen,
      setOmschrijving,
      setActiviteit,
      setOrganisatie,
      setSpecifiekLettenOp,
      setCurrentPoint,
    });
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
