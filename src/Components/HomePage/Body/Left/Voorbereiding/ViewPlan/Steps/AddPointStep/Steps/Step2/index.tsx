/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

import { useEffect, useState } from "react";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { SpatialReference } from "Types";
import CancelModal from "Components/HomePage/Body/Common/CancelModal";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { createNewPoint } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/helpers/createNewPoint";
import { useContent } from "hooks/useContent";

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

    if (coordinateSystem === "RD") {
      const { x: lonWgs84, y: latWgs84 } = getTransformedCoordinates(
        "RD",
        "WGS84",
        xCoord,
        yCoord
      );

      setLongitude(lonWgs84);
      setLatitude(latWgs84);

      drawLon = lonWgs84;
      drawLat = latWgs84;
    } else if (coordinateSystem === "WGS84") {
      const { x: rdX, y: rdY } = getTransformedCoordinates(
        "WGS84",
        "RD",
        longitude,
        latitude
      );

      setXCoord(rdX);
      setYCoord(rdY);
    }

    createNewPoint(redGraphicsLayer, setCurrentPoint, drawLon, drawLat);
  }

  useEffect(() => {
    if (coordinateSystem === "RD") {
      const { x: transformedX, y: transformedY } = getTransformedCoordinates(
        "RD",
        "WGS84",
        xCoord,
        yCoord
      );

      setLongitude(transformedX);
      setLatitude(transformedY);
    } else if (coordinateSystem === "WGS84") {
      const { x: transformedX, y: transformedY } = getTransformedCoordinates(
        "WGS84",
        "RD",
        longitude,
        latitude
      );

      setXCoord(transformedX);
      setYCoord(transformedY);
    }
  }, [xCoord, yCoord, coordinateSystem, longitude, latitude]);

  const content = useContent();

  return (
    <div className="text-gray-800 leading-3 text-[13px]">
      <p>
        {content.voorbereiding.vluchtplanInformatie.addPointStep.step2.text}
      </p>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-6 gap-x-2 items-center">
          <p className="col-span-2 labelClass">
            {
              content.voorbereiding.vluchtplanInformatie.addPointStep.step2
                .Coördinatensysteem
            }
            :
          </p>

          <select
            className="col-span-4 inputClass"
            name=""
            id=""
            value={coordinateSystem}
            onChange={(e) =>
              setCoordinateSystem(e.target.value as SpatialReference)
            }
          >
            <option value="RD">
              {content.voorbereiding.vluchtplanInformatie.addPointStep.step2.coordinates.at(
                0
              )}
            </option>
            <option value="WGS84">
              {content.voorbereiding.vluchtplanInformatie.addPointStep.step2.coordinates.at(
                1
              )}
            </option>
          </select>
        </div>

        {coordinateSystem === "RD" && (
          <>
            <div className="grid grid-cols-6 gap-x-2 items-center">
              <p className="col-span-2 labelClass">
                {" "}
                {
                  content.voorbereiding.vluchtplanInformatie.addPointStep.step2
                    .x
                }
              </p>
              <input
                className="inputClass col-span-4 !w-[60%]"
                type="number"
                value={xCoord}
                onChange={(e) => setXCoord(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-6 gap-x-2 items-center">
              <p className="col-span-2 labelClass">
                {
                  content.voorbereiding.vluchtplanInformatie.addPointStep.step2
                    .y
                }
              </p>
              <input
                className="inputClass col-span-4 !w-[60%]"
                type="number"
                value={yCoord}
                onChange={(e) => setYCoord(Number(e.target.value))}
              />
            </div>
          </>
        )}

        {coordinateSystem === "WGS84" && (
          <>
            <div className="grid grid-cols-6 gap-x-2 items-center">
              <p className="col-span-2 labelClass">
                {
                  content.voorbereiding.vluchtplanInformatie.addPointStep.step2
                    .long
                }
              </p>
              <input
                className="inputClass col-span-4 !w-[60%]"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-6 gap-x-2 items-center">
              <p className="col-span-2 labelClass">
                {
                  content.voorbereiding.vluchtplanInformatie.addPointStep.step2
                    .lat
                }
              </p>
              <input
                className="inputClass col-span-4 !w-[60%]"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>

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
