import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useState } from "react";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import CreateImageBtn from "./CreateImageBtn";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { MdLocationOn } from "react-icons/md";

export default function Foto({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const { selectedGeometry, selectedPlan, setSelectedPlan, setSelectedGeometry } =
    useFinishedPlansState();

  // Get first point from geometry
  const firstPoint = selectedGeometry?.points?.[0];

  const { mapView, redGraphicsLayer } = useMapViewState();

  const token = localStorage.getItem("credential_token");

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const { update } = useUpdateData(
    `/finished_plans/points/finishedPointAttachments`
  );

  const content = useContent();

  // Parse location string (format: "lat,long") and navigate to it
  const navigateToLocation = (location: string | null | undefined) => {
    if (!location || !mapView) return;

    try {
      const [lat, long] = location.split(",").map(Number);
      if (isNaN(lat) || isNaN(long)) return;

      const point = new Point({
        longitude: long,
        latitude: lat,
        spatialReference: { wkid: 4326 },
      });

      // Navigate to location
      mapView.goTo({
        target: point,
        zoom: 15,
      });

      // Add temporary marker
      if (redGraphicsLayer) {
        // Clear previous location markers
        const graphics = redGraphicsLayer.graphics.toArray();
        graphics
          .filter((g) => g.attributes?.type === "image-location-marker")
          .forEach((g) => redGraphicsLayer.remove(g));

        // Add new marker
        const markerSymbol = new SimpleMarkerSymbol({
          color: [255, 0, 0, 0.8], // Red with transparency
          size: 16,
          style: "circle",
          outline: {
            color: [255, 255, 255, 1],
            width: 2,
          },
        });

        const markerGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: { type: "image-location-marker" },
        });

        redGraphicsLayer.add(markerGraphic);

        // Remove marker after 5 seconds
        setTimeout(() => {
          redGraphicsLayer.remove(markerGraphic);
        }, 5000);
      }
    } catch (error) {
      console.error("Error parsing location:", error);
    }
  };

  if (
    !firstPoint ||
    !firstPoint.attachments ||
    firstPoint.attachments.length === 0
  ) {
    return (
      <div className="p-4">
        <p className="text-gray-400">
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.noImages
          }
        </p>

        <div className="flex justify-end">
          <button onClick={() => setAction("form")} className="gray-button">
            {content.common.vorige}
          </button>
        </div>
      </div>
    );
  }

  function deleteImage(attachmentId: number) {
    if (!firstPoint || !selectedGeometry || !selectedPlan) return;

    const currentIndex = activeIndex;
    const newAttachments = firstPoint.attachments.filter(
      (attachment) => attachment.id !== attachmentId
    );

    // Calculate new index after deletion
    let newIndex = 0;
    if (newAttachments && newAttachments.length > 0) {
      if (currentIndex >= newAttachments.length) {
        newIndex = newAttachments.length - 1;
      } else {
        newIndex = currentIndex;
      }
    } else {
      setIsOpen(false);
    }

    const body = {
      point_id: firstPoint.id,
      plan_id: selectedPlan.id,
      attachments_id: newAttachments.flatMap((attachment) => attachment.id),
    };

    update(body, (responseData) => {
      setActiveIndex(newIndex);

      // Update the first point's attachments
      const updatedFirstPoint: typeof firstPoint = {
        ...firstPoint,
        attachments: newAttachments,
      };

      // Update all points in geometry with the same attachments (if they share the same point)
      const updatedPoints = selectedGeometry.points.map((point) =>
        point.id === firstPoint.id ? updatedFirstPoint : point
      );

      const updatedGeometry: typeof selectedGeometry = {
        ...selectedGeometry,
        points: updatedPoints,
      };

      setSelectedGeometry(updatedGeometry);

      setSelectedPlan({
        ...selectedPlan,
        geometries: selectedPlan.geometries.map((geom) =>
          geom.id === selectedGeometry.id ? updatedGeometry : geom
        ),
        points_data: selectedPlan.points_data.map((point) => {
          if (point.id === firstPoint.id) {
            return updatedFirstPoint;
          }
          return point;
        }),
      });
    });
  }

  return (
    <div className="h-full">
      <div className="overflow-y-scroll pb-20 thin-scrollbar flex-grow">
        <div className="grid grid-cols-2 gap-2 p-2">
          {firstPoint.attachments
            .sort((attachment) => attachment.taken_at)
            .map(
              (attachment, index) =>
                attachment !== null && (
                  <div key={attachment.id} className="relative group">
                    <img
                      src={`${attachment.url
                        .split("token=")
                        .at(0)}token=${token}`}
                      alt={String(attachment.id)}
                      onClick={() => {
                        setActiveIndex(index);
                        setIsOpen(true);
                      }}
                      className="object-cover aspect-square cursor-pointer hover:scale-105 transition-all rounded shadow-md w-full"
                    />
                    {attachment.location && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToLocation(attachment.location);
                        }}
                        className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                        title="Show location on map"
                      >
                        <MdLocationOn className="size-4" />
                      </button>
                    )}
                  </div>
                )
            )}

          {firstPoint.attachments &&
            firstPoint.attachments.length > 0 && (
              <ImageGallery
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                attachments={firstPoint.attachments}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onDelete={deleteImage}
                onShowLocation={(location) => navigateToLocation(location)}
              />
            )}
        </div>
      </div>

      <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1 pr-3">
        <CreateImageBtn setLoading={setLoading} />

        <button onClick={() => setAction("form")} className="gray-button">
          {content.common.vorige}
        </button>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 h-full w-full bg-white/40 backdrop-blur-sm z-10 flex items-center justify-center">
          <LoadingBars />
        </div>
      )}
    </div>
  );
}

