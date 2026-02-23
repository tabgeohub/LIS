import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useContent } from "hooks/useContent";

interface LoadingPhaseProps {
  zippingStatus: string;
  isPreparingLink: boolean;
}

export default function LoadingPhase({
  zippingStatus,
  isPreparingLink,
}: LoadingPhaseProps) {
  const content = useContent();

  // Phase 1: generation/packaging in progress
  if (zippingStatus !== "finish.") {
    return (
      <div className="px-3 pt-2 flex flex-col items-center text-center">
        <p className="text-[14px] font-medium mb-2">{zippingStatus}</p>
        <LoadingBars />
        <p className="text-[12px] text-gray-500 mt-2">
          {content?.nabewerking?.createReport?.step3?.progressHint}
        </p>
      </div>
    );
  }

  // Phase 2: zipping finished but link still being prepared/uploaded
  if (isPreparingLink) {
    return (
      <div className="px-3 pt-2 flex flex-col items-center text-center">
        <p className="text-[14px] font-medium mb-2">
          {content.nabewerking.createReport.step3.preparingLink}
        </p>
        <LoadingBars />
        <p className="text-[12px] text-gray-500 mt-2">
          {content?.nabewerking?.createReport?.step3?.uploadingHint}
        </p>
      </div>
    );
  }

  return null;
}



