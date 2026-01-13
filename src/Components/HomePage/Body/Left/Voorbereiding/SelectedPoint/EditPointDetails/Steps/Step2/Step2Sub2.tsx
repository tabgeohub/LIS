import { useFormikContext } from "formik";
import { useEffect } from "react";
import InputFormik from "../../../Common/InputFormik";
import SelectFormik from "../../../Common/SelectFormik";
import { SpatialReference } from "Types";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import useLogAction from "hooks/useLogAction";

export default function Step2Sub2({
  setSubStep,
  handleSubmit,
}: {
  setSubStep: (value: number) => void;
  handleSubmit: () => void;
}) {
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

  useEffect(() => {
    if (values.coordinateSystem === "RD") {
      setValues({
        ...values,
        longitude: getTransformedCoordinates("RD", "WGS84", values.x, values.y)
          .x,
        latitude: getTransformedCoordinates("RD", "WGS84", values.x, values.y)
          .y,
      });

      logAction({
        message: "User changed the coordinate system to RD",
        newData: {
          x: values.x,
          y: values.y,
          longitude: values.longitude,
          latitude: values.latitude,
        },
      });
    } else if (values.coordinateSystem === "WGS84") {
      setValues({
        ...values,
        x: getTransformedCoordinates(
          "WGS84",
          "RD",
          values.longitude,
          values.latitude
        ).x,
        y: getTransformedCoordinates(
          "WGS84",
          "RD",
          values.longitude,
          values.latitude
        ).y,
      });

      logAction({
        message: "User changed the coordinate system to WGS84",
        newData: {
          x: values.x,
          y: values.y,
          longitude: values.longitude,
          latitude: values.latitude,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.coordinateSystem,
    values.x,
    values.y,
    values.latitude,
    values.longitude,
  ]);

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
