import { useState } from "react";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { MdLocationOn } from "react-icons/md";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import CreateImageBtn from "./CreateImageBtn";
import FotoEmptyState from "./FotoEmptyState";
import { filterValidAttachments } from "./filterValidAttachments";
import { useFotoMapClickHandler } from "./useFotoMapClickHandler";
import { useImageMarkersOnMap } from "./useImageMarkersOnMap";
import { navigateToLocation } from "./navigateToLocation";
import { runFotoAttachmentDelete } from "./runFotoAttachmentDelete";

export default function FotoPanel({
  setAction,
  attachmentPoint,
  selectedPlan,
  fileInputId,
  onAttachmentsUpdated,
}: {
  setAction: (value: string) => void;
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  fileInputId: string;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const content = useContent();

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const { update } = useUpdateData(
    `/finished_plans/points/finishedPointAttachments`
  );

  const validAttachments = filterValidAttachments({
    attachments: attachmentPoint?.attachments,
  });

  useFotoMapClickHandler({
    mapView,
    redGraphicsLayer,
    validAttachments,
    setActiveIndex,
    setIsOpen,
  });

  useImageMarkersOnMap({
    attachmentPoint,
    validAttachments,
    mapView,
    redGraphicsLayer,
  });

  const handleNavigateToLocation = (location: string | null | undefined) => {
    navigateToLocation({ location, mapView, redGraphicsLayer });
  };

  async function deleteImage(attachmentId: number) {
    if (!attachmentPoint || !selectedPlan) return;
    await runFotoAttachmentDelete({
      attachmentId,
      validAttachments,
      attachmentPoint,
      selectedPlan,
      activeIndex,
      setLoading,
      setIsOpen,
      setActiveIndex,
      onAttachmentsUpdated,
      update,
    });
  }

  if (!attachmentPoint) {
    return (
      <div className="h-full">
        <FotoEmptyState />
        <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1 pr-3">
          <button onClick={() => setAction("form")} className="gray-button">
            {content.common.vorige}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="overflow-y-scroll pb-20 thin-scrollbar flex-grow">
        {validAttachments.length === 0 ? (
          <FotoEmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            {validAttachments
              .sort((a, b) => a.taken_at - b.taken_at)
              .map((attachment, index) => (
                <div key={attachment.id} className="relative group">
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
                        handleNavigateToLocation(attachment.location);
                      }}
                      className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                      title="Show location on map"
                    >
                      <MdLocationOn className="size-4" />
                    </button>
                  )}
                </div>
              ))}

            <ImageGallery
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              attachments={validAttachments}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onDelete={deleteImage}
              onShowLocation={handleNavigateToLocation}
            />
          </div>
        )}
      </div>

      <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1 pr-3">
        <CreateImageBtn
          setLoading={setLoading}
          attachmentPoint={attachmentPoint}
          selectedPlan={selectedPlan}
          fileInputId={fileInputId}
          onAttachmentsUpdated={onAttachmentsUpdated}
        />

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
