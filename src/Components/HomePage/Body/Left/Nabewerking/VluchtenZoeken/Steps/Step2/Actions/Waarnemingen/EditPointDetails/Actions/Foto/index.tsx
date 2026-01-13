import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useState } from "react";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import CreateImageBtn from "./CreateImageBtn";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";

export default function Foto({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();
  const token = localStorage.getItem("credential_token");

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const { update } = useUpdateData(
    `/finished_plans/points/finishedPointAttachments`
  );

  const content = useContent();

  if (
    !selectedPoint ||
    !selectedPoint.attachments ||
    selectedPoint.attachments.length === 0
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
    const currentIndex = activeIndex;
    const newAttachments = selectedPoint?.attachments.filter(
      (attachment) => attachment.id !== attachmentId
    );

    // Calculate new index after deletion
    let newIndex = 0;
    if (newAttachments && newAttachments.length > 0) {
      if (currentIndex >= newAttachments.length) {
        // If we deleted the last item, show the new last item
        newIndex = newAttachments.length - 1;
      } else {
        // Otherwise, keep the same index (next image moves up)
        newIndex = currentIndex;
      }
    } else {
      // No attachments left - close gallery
      setIsOpen(false);
    }

    const body = {
      point_id: selectedPoint?.id,
      plan_id: selectedPlan?.id,
      attachments_id: newAttachments?.flatMap((attachment) => attachment.id),
    };

    update(body, (responseData) => {
      setActiveIndex(newIndex);

      setSelectedPlan({
        ...selectedPlan,
        // @ts-ignore
        points_data: selectedPlan?.points_data.map((point) => {
          if (point.id === selectedPoint?.id) {
            return {
              ...point,
              attachments: newAttachments,
            };
          }
          return point;
        }),
      });

      setSelectedPoint({
        ...selectedPoint,
        // @ts-ignore
        attachments: selectedPoint?.attachments.filter(
          (attachment) => attachment.id !== attachmentId
        ),
      });
    });
  }

  return (
    <div className="h-full">
      <div className="overflow-y-scroll pb-20 thin-scrollbar flex-grow">
        <div className="grid grid-cols-2 gap-2 p-2">
          {selectedPoint.attachments
            .sort((attachment) => attachment.taken_at)
            .map(
              (attachment, index) =>
                attachment !== null && (
                  <img
                    src={`${attachment.url
                      .split("token=")
                      .at(0)}token=${token}`}
                    key={attachment.id}
                    alt={String(attachment.id)}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsOpen(true);
                    }}
                    className="object-cover aspect-square cursor-pointer hover:scale-105 transition-all rounded shadow-md"
                  />
                )
            )}

          {selectedPoint.attachments &&
            selectedPoint.attachments.length > 0 && (
              <ImageGallery
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                attachments={selectedPoint.attachments}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onDelete={deleteImage}
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
