import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import { useContent } from "hooks/useContent";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";
import { useEditPointCoordinates } from "./useEditPointCoordinates";

export default function EditPointCoordinates({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const content = useContent();
  const logAction = useLogAction();
  const {
    selectedPoint,
    loading,
    coordinateSystem,
    setCoordinateSystem,
    xcoordinaat_rd,
    setXCoordinaat_rd,
    ycoordinaat_rd,
    setYCoordinaat_rd,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    handleSubmit,
  } = useEditPointCoordinates(setAction);

  if (!selectedPoint) return <div></div>;

  return (
    <ScrollButtonsLayout
      buttons={
        <>
          <button
            onClick={() => {
              setAction("form");
              logAction({
                message: "User clicked 'Previous' button",
                step: "Second step - Edit point coordinates",
              });
            }}
            className="gray-button"
          >
            {content.common.vorige}
          </button>

          <button onClick={handleSubmit} className="gray-button">
            {content.common.opslaan}
          </button>
        </>
      }
    >
      <div className="px-2 space-y-3 mt-4">
        <p className="text-gray-800 leading-3 text-[12px]">
          Wijzig de coördinaten van het punt. U kunt ook op de kaart klikken om
          de coördinaten bij te werken.
        </p>

        <SelectComp
          value={coordinateSystem}
          setValue={setCoordinateSystem}
          label="Coördinatensysteem"
          options={[
            { value: "RD", label: "RD" },
            { value: "WGS84", label: "WGS84" },
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

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500/20 bg-opacity-50 z-10">
          <LoadingBars />
        </div>
      )}
    </ScrollButtonsLayout>
  );
}
