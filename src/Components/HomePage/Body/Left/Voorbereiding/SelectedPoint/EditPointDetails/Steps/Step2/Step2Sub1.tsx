import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFormikContext } from "formik";
import useLogAction from "hooks/useLogAction";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";

export default function Step2Sub1({
  setStep,
  setSubStep,
  subStep,
  isLoading,
  handleSubmit,
  currentPoint,
  setCurrentPoint,
}: {
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  subStep: number;
  isLoading: boolean;
  handleSubmit: () => void;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
}) {
  const logAction = useLogAction();

  const { mapView, redGraphicsLayer } = useMapViewState();

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
  }>();

  const [mapClickedNotify, setMapClickedNotify] = useState(0);

  useEffect(() => {
    let clickHandle: __esri.Handle;

    if (subStep === 1 && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        // Prevent other global handlers from hijacking the click
        // @ts-ignore ArcGIS event may expose stopPropagation
        event.stopPropagation?.();

        if (!event.mapPoint.longitude || !event.mapPoint.latitude) return;

        setMapClickedNotify(mapClickedNotify + 1);

        setCurrentPoint({
          x: event.mapPoint.longitude,
          y: event.mapPoint.latitude,
        });

        // Always clear previous temp graphic and draw a new red point
        redGraphicsLayer?.removeAll();

        // Ensure temp layer is on top
        if (mapView.map && redGraphicsLayer) {
          mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);
        }

        const transformed = getTransformedCoordinates(
          "WGS84",
          "RD",
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );

        setValues({
          ...values,
          x: transformed.x,
          y: transformed.y,
          latitude: event.mapPoint.latitude,
          longitude: event.mapPoint.longitude,
        });

        const pointGraphic = createPoint(
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );

        if (redGraphicsLayer) {
          redGraphicsLayer.add(pointGraphic);
        } else {
          mapView.graphics.add(pointGraphic);
        }

        logAction({
          message: "User clicked on a point",
          newData: {
            point: {
              x: event.mapPoint.longitude,
              y: event.mapPoint.latitude,
            },
          },
        });
      });
    }

    return () => {
      clickHandle?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPoint,
    mapClickedNotify,
    mapView,
    redGraphicsLayer,
    setValues,
    subStep,
  ]);

  return (
    <div>
      <p className="text-gray-800 leading-3 text-[12px]">Klik op de kaart</p>

      <p className="text-gray-800 leading-3 text-[12px] mt-2">
        Klik in de kaart om de locatie van het aandachtspunt in te tekenen of
        kies voor de optie "invoeren' om de coordinaten van het aandachtspunt op
        te geven.
      </p>

      <div className="bg-gray-100 group cursor-pointer hover:bg-primary border transition-all duration-300 w-[35px] aspect-square border-gray-200 rounded-lg flex items-center justify-center mt-4">
        <div className="bg-primary group-hover:bg-gray-100 border w-2 h-2 rounded-full transition-all duration-300" />
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button onClick={handleSubmit} className="gray-button">
          Opslaan
        </button>

        <button
          onClick={() => {
            setSubStep(2);

            logAction({
              message: "User clicked 'Enter coordinates' button",
              step: "Edit point details - Step 2",
            });
          }}
          className="gray-button"
        >
          Coördinaten invoeren
        </button>

        <button
          className="gray-button"
          onClick={() => {
            setStep(1);

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Edit point details - Step 2",
            });
          }}
        >
          Annuleren
        </button>
      </div>

      {isLoading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">Bezig met opslaan...</p>
          </div>
        </div>
      )}
    </div>
  );
}
