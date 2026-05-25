import { useState } from "react";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { FlightPlanType } from "Types";
import { AttachmentType } from "Types/finished_plans";
import { usePlanPointAttachments } from "api-hooks/finishedPlans";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";

export default function Images({
  selectedPlan,
}: {
  selectedPlan: FlightPlanType;
}) {
  const { clickedPoint } = usePopUpState();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: attachments } = usePlanPointAttachments(
    selectedPlan.id,
    clickedPoint?.id,
    Boolean(selectedPlan.is_finished && clickedPoint)
  );

  const token = localStorage.getItem("credential_token");

  const sortedAttachments = attachments
    ? [...attachments].sort((a, b) => (a.taken_at || 0) - (b.taken_at || 0))
    : [];

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {selectedPlan.is_finished &&
        attachmentsUrl &&
        attachments &&
        attachments.length > 0 && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-gray-700">Foto's</label>

            <div className="grid grid-cols-2 gap-2">
              {sortedAttachments.map((attachment, index) => (
                <img
                  key={attachment.id}
                  src={`${attachment.url.split("token=").at(0)}token=${token}`}
                  alt={`Attachment ${attachment.id}`}
                  className="object-cover aspect-square cursor-pointer hover:scale-105 transition-all rounded shadow-md"
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </div>
        )}

      {selectedPlan.is_finished &&
        attachmentsUrl &&
        attachments &&
        attachments.length === 0 && (
          <div className="text-sm text-gray-500">
            Geen afbeeldingen beschikbaar
          </div>
        )}

      {sortedAttachments.length > 0 && (
        <ImageGallery
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          attachments={sortedAttachments}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}
    </>
  );
}
