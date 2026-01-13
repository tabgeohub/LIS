/* eslint-disable react-hooks/exhaustive-deps */
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

import { useEffect, useState } from "react";

export default function Step2Sub2({
  setSubStep,
  handleSubmit,
}: {
  setSubStep: (value: number) => void;
  handleSubmit: () => void;
}) {
  const logAction = useLogAction();

  const [coordinateSystem, setCoordinateSystem] = useState<string>("RD");

  const {
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,
    setXCoordinaat_rd,
    setYCoordinaat_rd,
    setLatitude,
    setLongitude,
  } = useDeletePointState();

  useEffect(() => {
    if (coordinateSystem === "RD") {
      setLatitude(
        getTransformedCoordinates("RD", "WGS84", xcoordinaat_rd, ycoordinaat_rd)
          .y
      );
      setLongitude(
        getTransformedCoordinates("RD", "WGS84", xcoordinaat_rd, ycoordinaat_rd)
          .x
      );
      setXCoordinaat_rd(xcoordinaat_rd);
      setYCoordinaat_rd(ycoordinaat_rd);
    } else if (coordinateSystem === "WGS84") {
      setXCoordinaat_rd(
        getTransformedCoordinates("WGS84", "RD", longitude, latitude).x
      );
      setYCoordinaat_rd(
        getTransformedCoordinates("WGS84", "RD", longitude, latitude).y
      );
      setLatitude(latitude);
      setLongitude(longitude);
    }

    logAction({
      message: "User changed coordinate system",
      step: "Edit point details - Step 2",
      newData: {
        coordinateSystem,
        xcoordinaat_rd,
        ycoordinaat_rd,
        latitude,
        longitude,
      },
    });
  }, [coordinateSystem, latitude, longitude, xcoordinaat_rd, ycoordinaat_rd]);

  const content = useContent();

  return (
    <div>
      <p className="text-gray-800 leading-3 text-[12px]">
        {
          content.tools.aandachtspuntenVerwijderen.editPoint.step2
            .coördinatenInvoeren
        }
      </p>

      <div className="mt-6 space-y-3">
        <SelectComp
          value={coordinateSystem}
          setValue={setCoordinateSystem}
          label="Coördinatensysteem"
          options={[
            {
              value: "RD",
              label: "RD",
            },
            {
              value: "WGS84",
              label: "WGS84",
            },
          ]}
        />

        {coordinateSystem === "RD" && (
          <>
            <InputCompNum
              label="X"
              value={xcoordinaat_rd}
              setValue={setXCoordinaat_rd}
            />

            <InputCompNum
              label="Y"
              value={ycoordinaat_rd}
              setValue={setYCoordinaat_rd}
            />
          </>
        )}

        {coordinateSystem === "WGS84" && (
          <>
            <InputCompNum
              label="Longitude"
              value={longitude}
              setValue={setLongitude}
            />
            <InputCompNum
              label="Latitude"
              value={latitude}
              setValue={setLatitude}
            />
          </>
        )}
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            setSubStep(1);

            logAction({
              message: "User clicked 'Back' button",
              step: "Edit point details - Step 2",
            });
          }}
          className="gray-button"
        >
          Vorige
        </button>

        <button className="gray-button" onClick={handleSubmit}>
          Opslaan
        </button>
      </div>
    </div>
  );
}
