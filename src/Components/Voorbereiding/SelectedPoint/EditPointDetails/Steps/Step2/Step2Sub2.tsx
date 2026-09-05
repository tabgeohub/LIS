import { useFormikContext } from "formik";
import InputFormik from "Components/Voorbereiding/SelectedPoint/Common/InputFormik";
import SelectFormik from "Components/Voorbereiding/SelectedPoint/Common/SelectFormik";
import type { EditPointStep2Sub2Props } from "Components/Common/EditPoint/editPointStep2Sub2Props";
import { SpatialReference } from "Types";
import useLogAction from "hooks/useLogAction";
import { useCoordinateSystemSync } from "hooks/editPoint/useCoordinateSystemSync";
import {
  coordinateSystemChangeLogMessage,
  nextValuesAfterCoordinatePatch,
} from "./applyEditPointCoordinatePatch";

export default function Step2Sub2({
  setSubStep,
  handleSubmit,
}: EditPointStep2Sub2Props) {
  const logAction = useLogAction();

  const { values, setValues } = useFormikContext<{
    id: number;
    herhalen: number;
    omschrijving: string;
    datum: number;
    regio_id: string;
    activiteit_id: string;
    organisatie_id: string;
    specifiek_letten_op: string;
    rd: string;
    wgs84: string;
    vertrouwelijk: number;
    x: number;
    y: number;
    longitude: number;
    latitude: number;
    coordinateSystem: SpatialReference;
  }>();

  useCoordinateSystemSync({
    coordinateSystem: values.coordinateSystem,
    rdX: values.x,
    rdY: values.y,
    latitude: values.latitude,
    longitude: values.longitude,
    patchCoords: (patch) => {
      setValues(nextValuesAfterCoordinatePatch(values, patch));
      const message = coordinateSystemChangeLogMessage(values.coordinateSystem);
      if (!message) return;
      logAction({
        message,
        newData: {
          x: values.x,
          y: values.y,
          longitude: values.longitude,
          latitude: values.latitude,
        },
      });
    },
  });

  return (
    <div>
      <p className="text-gray-800 leading-3 text-[12px]">
        Klik op 'update' om een voorbeeldpunt te tekenen op de kaart.
      </p>

      <div className="mt-6 space-y-3">
        <SelectFormik
          label="Coördinatensysteem"
          name="coordinateSystem"
          required={true}
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

        {values.coordinateSystem === "RD" && (
          <>
            <InputFormik label="X" name="x" type="number" required={true} />
            <InputFormik label="Y" name="y" type="number" required={true} />
          </>
        )}

        {values.coordinateSystem === "WGS84" && (
          <>
            <InputFormik label="Longitude" name="longitude" type="number" />
            <InputFormik label="Latitude" name="latitude" type="number" />
          </>
        )}
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            setSubStep(1);

            logAction({
              message: "User clicked 'Previous' button",
              step: "Edit point details - Step 2",
            });
          }}
          className="gray-button"
        >
          Vorige
        </button>

        <button
          className="gray-button"
          onClick={() => {
            handleSubmit();

            logAction({
              message: "User clicked 'Save' button",
              step: "Edit point details - Step 2",
            });
          }}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
}
