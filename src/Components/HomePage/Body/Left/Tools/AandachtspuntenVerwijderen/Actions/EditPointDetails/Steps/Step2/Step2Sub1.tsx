/* eslint-disable react-hooks/exhaustive-deps */
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
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

  const content = useContent();

  return (
    <div>
      <p className="text-gray-800 leading-3 text-[12px]">Klik op de kaart</p>

      <p className="text-gray-800 leading-3 text-[12px] mt-2">
        {content.tools.aandachtspuntenVerwijderen.editPoint.step2.text1}
      </p>

      <div className="bg-gray-100 group cursor-pointer hover:bg-primary border transition-all duration-300 w-[35px] aspect-square border-gray-200 rounded-lg flex items-center justify-center mt-4">
        <div className="bg-primary group-hover:bg-gray-100 border w-2 h-2 rounded-full transition-all duration-300" />
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            handleSubmit();

            logAction({
              message: "User clicked 'Save' button",
              step: "Edit point details - Step 2",
            });
          }}
          className="gray-button"
        >
          {content.common.opslaan}
        </button>

        <button
          onClick={() => {
            setSubStep(2);

            logAction({
              message: "User clicked 'Edit geometry' button",
              step: "Edit point details - Step 2",
            });
          }}
          className="gray-button"
        >
          {
            content.tools.aandachtspuntenVerwijderen.editPoint.step2
              .coördinatenInvoeren
          }
        </button>

        <button
          className="gray-button"
          onClick={() => {
            setStep(1);

            logAction({
              message: "User clicked 'Back' button",
              step: "Edit point details - Step 2",
            });
          }}
        >
          {content.common.annuleren}
        </button>
      </div>

      {isLoading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">
              {content.tools.aandachtspuntenVerwijderen.editPoint.step2.loading}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
