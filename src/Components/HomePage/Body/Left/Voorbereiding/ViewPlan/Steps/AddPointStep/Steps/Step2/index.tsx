/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

import { useState } from "react";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { pickEnrichedCoordinateControls } from "hooks/zustand/pickEnrichedCoordinateControls";
import CancelModal from "Components/HomePage/Body/Common/CancelModal";
import { createNewPoint } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/helpers/createNewPoint";
import { useContent } from "hooks/useContent";
import CoordinateFields from "Components/HomePage/Body/Left/Common/CoordinateFields";
import useCoordinatesWatcher from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/Steps/Step2/useCoordinatesWatcher";
import { syncEnrichedCoordsForPreview } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/Steps/Step2/syncEnrichedCoordsForPreview";

export default function Step2({
  handleCancel,
  setAddPointStep,
}: {
  handleCancel: () => void;
  setAddPointStep: (value: number) => void;
}) {
  const { redGraphicsLayer } = useMapViewState();
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const state = useEnrichedPointState();
  const coords = pickEnrichedCoordinateControls(state);

  function handleUpdate(): void {
    if (!redGraphicsLayer) return;

    const { drawLon, drawLat } = syncEnrichedCoordsForPreview(coords);

    createNewPoint({
      redGraphicsLayer,
      setCurrentPoint: state.setCurrentPoint,
      xCoord: drawLon,
      yCoord: drawLat,
    });
  }

  useCoordinatesWatcher();

  const content = useContent();

  return (
    <div className="text-gray-800 leading-3 text-[13px]">
      <p>
        {content.voorbereiding.vluchtplanInformatie.addPointStep.step2.text}
      </p>

      <CoordinateFields
        coordinateSystem={coords.coordinateSystem}
        setCoordinateSystem={state.setCoordinateSystem}
        xCoord={coords.xCoord}
        setXCoord={coords.setXCoord}
        yCoord={coords.yCoord}
        setYCoord={coords.setYCoord}
        longitude={coords.longitude}
        setLongitude={coords.setLongitude}
        latitude={coords.latitude}
        setLatitude={coords.setLatitude}
        labels={{
          coordinateSystem:
            content.voorbereiding.vluchtplanInformatie.addPointStep.step2
              .Coördinatensysteem,
          coordinates:
            content.voorbereiding.vluchtplanInformatie.addPointStep.step2
              .coordinates,
          x: content.voorbereiding.vluchtplanInformatie.addPointStep.step2.x,
          y: content.voorbereiding.vluchtplanInformatie.addPointStep.step2.y,
          longitude:
            content.voorbereiding.vluchtplanInformatie.addPointStep.step2.long,
          latitude:
            content.voorbereiding.vluchtplanInformatie.addPointStep.step2.lat,
        }}
      />

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button onClick={() => setAddPointStep(1)} className="gray-button">
          {content.common.vorige}
        </button>

        <button onClick={handleUpdate} className="gray-button">
          {content.common.update}
        </button>

        <button
          onClick={() => setAddPointStep(3)}
          disabled={coords.xCoord === 0 && coords.yCoord === 0}
          className="gray-button"
        >
          {content.common.volgende}
        </button>

        <button onClick={handleCancel} className="gray-button">
          {content.common.annuleren}
        </button>
      </div>

      <CancelModal
        handleCancel={() => setOpenCancelModal(false)}
        handleSubmit={handleCancel}
        isOpen={openCancelModal}
        setIsOpen={setOpenCancelModal}
      />
    </div>
  );
}
