/* eslint-disable react-hooks/exhaustive-deps */
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import EditPointMapClickStep from "Components/HomePage/Body/Common/EditPoint/EditPointMapClickStep";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
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
  const content = useContent();

  const { mapView, redGraphicsLayer } = useMapViewState();

  const [mapClickedNotify, setMapClickedNotify] = useState(0);

  const { setXCoordinaat_rd, setYCoordinaat_rd, setLatitude, setLongitude } =
    useDeletePointState();

  useEffect(() => {
    let clickHandle: __esri.Handle;

    if (subStep === 1 && mapView && redGraphicsLayer) {
      clickHandle = mapView.on("click", async (event) => {
        redGraphicsLayer.removeAll();
        const hitTestResults = await mapView.hitTest(event);

        const existingFeature = hitTestResults.results.find(
          (result) => (result as __esri.GraphicHit).graphic
        );

        if (
          !event.mapPoint ||
          !event.mapPoint.longitude ||
          !event.mapPoint.latitude
        )
          return;

        if (!existingFeature) {
          setMapClickedNotify(mapClickedNotify + 1);

          setCurrentPoint({
            x: event.mapPoint.longitude,
            y: event.mapPoint.latitude,
          });

          if (currentPoint.x !== 0 && currentPoint.y !== 0) {
            const graphicToUpdate = mapView.graphics
              .toArray()
              .find(
                (graphic: __esri.Graphic) =>
                  graphic.geometry &&
                  graphic.geometry.type === "point" &&
                  graphic.geometry.x === currentPoint.x &&
                  graphic.geometry.y === currentPoint.y
              );

            if (graphicToUpdate) {
              mapView.graphics.remove(graphicToUpdate);
            }

            const transformed = getTransformedCoordinates(
              "WGS84",
              "RD",
              event.mapPoint.longitude,
              event.mapPoint.latitude
            );

            setXCoordinaat_rd(transformed.x);
            setYCoordinaat_rd(transformed.y);
            setLatitude(event.mapPoint.latitude);
            setLongitude(event.mapPoint.longitude);

            const newPointGraphic = createPoint(
              event.mapPoint.longitude,
              event.mapPoint.latitude
            );

            redGraphicsLayer.add(newPointGraphic);
          } else {
            const transformed = getTransformedCoordinates(
              "WGS84",
              "RD",
              event.mapPoint.longitude,
              event.mapPoint.latitude
            );

            setXCoordinaat_rd(transformed.x);
            setYCoordinaat_rd(transformed.y);
            setLatitude(event.mapPoint.latitude);
            setLongitude(event.mapPoint.longitude);

            const pointGraphic = createPoint(
              event.mapPoint.longitude,
              event.mapPoint.latitude
            );

            redGraphicsLayer.add(pointGraphic);
          }
        }
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [currentPoint.x, currentPoint.y, mapClickedNotify, mapView, subStep]);

  return (
    <EditPointMapClickStep
      instructionText={
        content.tools.aandachtspuntenVerwijderen.editPoint.step2.text1
      }
      saveLabel={content.common.opslaan}
      enterCoordinatesLabel={
        content.tools.aandachtspuntenVerwijderen.editPoint.step2
          .coördinatenInvoeren
      }
      cancelLabel={content.common.annuleren}
      onSave={() => {
        handleSubmit();

        logAction({
          message: "User clicked 'Save' button",
          step: "Edit point details - Step 2",
        });
      }}
      onEnterCoordinates={() => {
        setSubStep(2);

        logAction({
          message: "User clicked 'Edit geometry' button",
          step: "Edit point details - Step 2",
        });
      }}
      onCancel={() => {
        setStep(1);

        logAction({
          message: "User clicked 'Back' button",
          step: "Edit point details - Step 2",
        });
      }}
      isLoading={isLoading}
      loadingText={
        content.tools.aandachtspuntenVerwijderen.editPoint.step2.loading
      }
    />
  );
}
