import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useState, useEffect, useRef } from "react";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import CreateImageBtn from "./CreateImageBtn";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import { MdLocationOn } from "react-icons/md";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";
import { deleteArcgisPointAttachment } from "@helpers/arcgis/deleteArcgisAttachment";
import toast from "react-hot-toast";

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

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const { update } = useUpdateData(
    `/finished_plans/points/finishedPointAttachments`
  );

  const content = useContent();
  const validAttachments = (firstPoint?.attachments ?? []).filter(
    (attachment): attachment is NonNullable<typeof firstPoint.attachments>[number] =>
      attachment !== null &&
      typeof attachment === "object" &&
      typeof attachment.url === "string" &&
      attachment.url.length > 0
  );

  // Store references to image markers for cleanup
  const imageMarkersRef = useRef<Graphic[]>([]);

  // Handle map clicks on image markers
  useEffect(() => {
    if (!mapView || !redGraphicsLayer || validAttachments.length === 0) return;

    const handleMapClick = async (event: __esri.ViewClickEvent) => {
      try {
        // Query graphics at the click location, only check redGraphicsLayer
        const hitTestResult = await mapView.hitTest(event, {
          include: [redGraphicsLayer],
        });

        const clickedGraphic = hitTestResult.results
          .filter((result): result is __esri.GraphicHit =>
            result.type === "graphic" && (result as __esri.GraphicHit).graphic !== undefined
          )
          .map((result) => (result as __esri.GraphicHit).graphic)
          .find((graphic) =>
            graphic?.attributes?.type === "image-numbered-marker" ||
            graphic?.attributes?.type === "image-numbered-marker-label"
          );

        if (clickedGraphic) {
          const attachmentId = clickedGraphic.attributes?.attachmentId;

          if (attachmentId !== undefined) {
            // Find the index in the sorted array
            const sortedIndex = [...validAttachments]
              .sort((a, b) => a.taken_at - b.taken_at)
              .findIndex((att) => att.id === attachmentId);

            if (sortedIndex !== -1) {
              setActiveIndex(sortedIndex);
              setIsOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Error handling marker click:", error);
      }
    };

    const handle = mapView.on("click", handleMapClick);

    return () => {
      handle.remove();
    };
  }, [mapView, validAttachments, redGraphicsLayer, setIsOpen, setActiveIndex]);

  // Create numbered markers on the map for images with locations
  useEffect(() => {
    if (!firstPoint || !mapView || !redGraphicsLayer) {
      return;
    }

    // Clear previous image markers
    imageMarkersRef.current.forEach((marker) => {
      redGraphicsLayer.remove(marker);
    });
    imageMarkersRef.current = [];

    // Get sorted attachments with their indices
    const sortedAttachments = [...validAttachments]
      .sort((a, b) => a.taken_at - b.taken_at)
      .map((attachment, originalIndex) => ({
        attachment,
        displayNumber: originalIndex + 1, // 1-based numbering
        originalIndex,
      }))
      .filter((item) => item.attachment.location); // Only include attachments with locations

    if (sortedAttachments.length === 0) return;

    // Track locations to handle duplicates (offset them slightly)
    const locationMap = new Map<string, number>();

    sortedAttachments.forEach(({ attachment, displayNumber, originalIndex }) => {
      if (!attachment.location) return;

      try {
        const [lat, long] = attachment.location.split(",").map(Number);
        if (isNaN(lat) || isNaN(long)) return;

        // Handle duplicate locations by offsetting
        const locationKey = `${lat.toFixed(6)},${long.toFixed(6)}`;
        const offsetCount = locationMap.get(locationKey) || 0;
        locationMap.set(locationKey, offsetCount + 1);

        // Small offset for duplicates (about 10 meters)
        const offsetDistance = 0.0001; // ~11 meters
        const angle = (offsetCount * 60) * (Math.PI / 180); // 60 degrees between duplicates
        const offsetLat = lat + offsetDistance * Math.cos(angle) * offsetCount;
        const offsetLong = long + offsetDistance * Math.sin(angle) * offsetCount;

        const point = new Point({
          longitude: offsetLong,
          latitude: offsetLat,
          spatialReference: { wkid: 4326 },
        });

        // Create circle marker (smaller)
        const circleSymbol = new SimpleMarkerSymbol({
          color: [59, 130, 246, 0.9], // Blue color
          size: 18, // Smaller size
          style: "circle",
          outline: {
            color: [255, 255, 255, 1],
            width: 1.5,
          },
        });

        const circleGraphic = new Graphic({
          geometry: point,
          symbol: circleSymbol,
          attributes: {
            type: "image-numbered-marker",
            imageIndex: originalIndex,
            displayNumber,
            attachmentId: attachment.id,
          },
        });

        // Create text label (centered)
        const textSymbol = new TextSymbol({
          text: String(displayNumber),
          color: [255, 255, 255, 1],
          font: {
            size: 10,
            family: "Arial",
            weight: "bold",
          },
          haloColor: [59, 130, 246, 0.8],
          haloSize: 1,
          xoffset: 0, // Center horizontally
          yoffset: 0, // Center vertically
        });

        const textGraphic = new Graphic({
          geometry: point,
          symbol: textSymbol,
          attributes: {
            type: "image-numbered-marker-label",
            imageIndex: originalIndex,
            displayNumber,
            attachmentId: attachment.id,
          },
        });

        redGraphicsLayer.add(circleGraphic);
        redGraphicsLayer.add(textGraphic);

        imageMarkersRef.current.push(circleGraphic, textGraphic);
      } catch (error) {
        console.error("Error creating marker for image:", error);
      }
    });

    // Cleanup function
    return () => {
      imageMarkersRef.current.forEach((marker) => {
        redGraphicsLayer.remove(marker);
      });
      imageMarkersRef.current = [];
    };
  }, [validAttachments, firstPoint, mapView, redGraphicsLayer]);

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
    validAttachments.length === 0
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

  async function deleteImage(attachmentId: number) {
    if (!firstPoint || !selectedGeometry || !selectedPlan) return;

    const removed = validAttachments.find((a) => a.id === attachmentId);
    if (!removed?.url) return;

    setLoading(true);
    try {
      await deleteArcgisPointAttachment(
        removed.url,
        removed.attachmentid ?? null
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Verwijderen op kaartlaag mislukt"
      );
      setLoading(false);
      return;
    }

    const currentIndex = activeIndex;
    const newAttachments = validAttachments.filter(
      (attachment) => attachment && attachment.id !== attachmentId
    );

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

    update(
      body,
      () => {
        setActiveIndex(newIndex);

        const updatedFirstPoint: typeof firstPoint = {
          ...firstPoint,
          attachments: newAttachments,
        };

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

        setLoading(false);
      },
      () => setLoading(false)
    );
  }

  return (
    <div className="h-full">
      <div className="overflow-y-scroll pb-20 thin-scrollbar flex-grow">
        <div className="grid grid-cols-2 gap-2 p-2">
          {validAttachments
            .sort((attachment) => attachment.taken_at)
            .map(
              (attachment, index) =>
                attachment !== null && (
                  <div key={attachment.id} className="relative group">
                    {/* Number badge in top-left */}
                    <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-20 shadow-lg">
                      {index + 1}
                    </div>
                    <img
                      src={attachmentDisplayUrl(attachment.url)}
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

          {validAttachments.length > 0 && (
              <ImageGallery
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                attachments={validAttachments}
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

