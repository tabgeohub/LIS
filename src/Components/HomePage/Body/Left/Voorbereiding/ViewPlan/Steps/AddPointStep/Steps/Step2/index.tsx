/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

import { useState } from "react";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import CancelModal from "Components/HomePage/Body/Common/CancelModal";
import { buildCoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import { createNewPoint } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/helpers/createNewPoint";
import { useContent } from "hooks/useContent";
import CoordinateFields from "Components/HomePage/Body/Left/Common/CoordinateFields";
import useCoordinatesWatcher from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/Steps/Step2/useCoordinatesWatcher";

export default function Step2({
  handleCancel,
  setAddPointStep,
}: {
  handleCancel: () => void;
  setAddPointStep: (value: number) => void;
}) {
  const { redGraphicsLayer } = useMapViewState();
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const {
    xCoord,
    yCoord,
    coordinateSystem,
    setCoordinateSystem,
    setCurrentPoint,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setXCoord,
    setYCoord,
  } = useEnrichedPointState();

  function handleUpdate(): void {
    if (!redGraphicsLayer) return;

    let drawLon = longitude;
    let drawLat = latitude;

    const patch = buildCoordinateSyncPatch({
      coordinateSystem,
      rdX: xCoord,
      rdY: yCoord,
      latitude,
      longitude,
    });
    if (patch?.longitude !== undefined) {
      setLongitude(patch.longitude);
      drawLon = patch.longitude;
    }
    if (patch?.latitude !== undefined) {
      setLatitude(patch.latitude);
      drawLat = patch.latitude;
    }
    if (patch?.rdX !== undefined) setXCoord(patch.rdX);
    if (patch?.rdY !== undefined) setYCoord(patch.rdY);

    createNewPoint({
      redGraphicsLayer,
      setCurrentPoint,
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
        coordinateSystem={coordinateSystem}
        setCoordinateSystem={setCoordinateSystem}
        xCoord={xCoord}
        setXCoord={setXCoord}
        yCoord={yCoord}
        setYCoord={setYCoord}
        longitude={longitude}
        setLongitude={setLongitude}
        latitude={latitude}
        setLatitude={setLatitude}
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
          disabled={xCoord === 0 && yCoord === 0}
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
