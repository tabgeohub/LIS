import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import EditPointMapClickStep from "Components/HomePage/Body/Common/EditPoint/EditPointMapClickStep";
import { useFormikContext } from "formik";
import useLogAction from "hooks/useLogAction";
import { useEffect, useState } from "react";

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
        // @ts-ignore ArcGIS event may expose stopPropagation
        event.stopPropagation?.();

        if (!event.mapPoint.longitude || !event.mapPoint.latitude) return;

        setMapClickedNotify(mapClickedNotify + 1);

        setCurrentPoint({
          x: event.mapPoint.longitude,
          y: event.mapPoint.latitude,
        });

        redGraphicsLayer?.removeAll();

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
    <EditPointMapClickStep
      instructionText={`Klik in de kaart om de locatie van het aandachtspunt in te tekenen of kies voor de optie "invoeren' om de coordinaten van het aandachtspunt op te geven.`}
      saveLabel="Opslaan"
      enterCoordinatesLabel="Coördinaten invoeren"
      cancelLabel="Annuleren"
      onSave={handleSubmit}
      onEnterCoordinates={() => {
        setSubStep(2);

        logAction({
          message: "User clicked 'Enter coordinates' button",
          step: "Edit point details - Step 2",
        });
      }}
      onCancel={() => {
        setStep(1);

        logAction({
          message: "User clicked 'Cancel' button",
          step: "Edit point details - Step 2",
        });
      }}
      isLoading={isLoading}
      loadingText="Bezig met opslaan..."
    />
  );
}
