import { useState } from "react";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { FlightPlanType } from "Types";
import { usePlanPointAttachments } from "api-hooks/finishedPlans";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import PlanAttachmentGrid from "./PlanAttachmentGrid";
import { resolvePlanImagesState } from "./planImagesState";

export default function Images({
  selectedPlan,
}: {
  selectedPlan: FlightPlanType;
}) {
  const { clickedPoint } = usePopUpState();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: attachments, isLoading } = usePlanPointAttachments({
    planId: selectedPlan.id,
    pointId: clickedPoint?.id,
    isFinished: Boolean(selectedPlan.is_finished && clickedPoint),
  });

  const state = resolvePlanImagesState({
    isFinished: Boolean(selectedPlan.is_finished),
    isLoading,
    attachments,
  });

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  if (state.kind === "hidden" || state.kind === "loading") return null;
  if (state.kind === "empty") {
    return <div className="text-sm text-gray-500">Geen afbeeldingen beschikbaar</div>;
  }

  return (
    <>
      <PlanAttachmentGrid
        attachments={state.attachments}
        onImageClick={handleImageClick}
      />
      <ImageGallery
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        attachments={state.attachments}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  );
}
