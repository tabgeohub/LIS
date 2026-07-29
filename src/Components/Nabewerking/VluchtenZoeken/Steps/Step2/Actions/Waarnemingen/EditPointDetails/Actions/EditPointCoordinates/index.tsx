import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { useContent } from "hooks/useContent";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useEditPointCoordinates } from "./useEditPointCoordinates";
import { EditPointCoordinatesButtons } from "./EditPointCoordinatesButtons";
import { EditPointCoordinatesForm } from "./EditPointCoordinatesForm";

export default function EditPointCoordinates({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const content = useContent();
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
        <EditPointCoordinatesButtons
          vorigeLabel={content.common.vorige}
          opslaanLabel={content.common.opslaan}
          onPrevious={() => setAction("form")}
          onSubmit={handleSubmit}
        />
      }
    >
      <EditPointCoordinatesForm
        coordinateSystem={coordinateSystem}
        setCoordinateSystem={setCoordinateSystem}
        xcoordinaat_rd={xcoordinaat_rd}
        setXCoordinaat_rd={setXCoordinaat_rd}
        ycoordinaat_rd={ycoordinaat_rd}
        setYCoordinaat_rd={setYCoordinaat_rd}
        longitude={longitude}
        setLongitude={setLongitude}
        latitude={latitude}
        setLatitude={setLatitude}
      />

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500/20 bg-opacity-50 z-10">
          <LoadingBars />
        </div>
      )}
    </ScrollButtonsLayout>
  );
}
