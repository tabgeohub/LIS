import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useContent } from "hooks/useContent";
import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";

interface LoadingPhaseProps {
  zippingStatus: string;
  isPreparingLink: boolean;
}

export default function LoadingPhase({
  zippingStatus,
  isPreparingLink,
}: LoadingPhaseProps) {
  const content = useContent();
  const { setStep, setZippingStatus } = useCreateReportState();

  if (zippingStatus.startsWith("error:")) {
    return (
      <div className="px-3 pt-2 flex flex-col items-center text-center gap-3">
        <p className="text-[14px] font-medium text-red-600">
          Rapport genereren mislukt
        </p>
        <p className="text-[12px] text-gray-600">{zippingStatus.slice(6)}</p>
        <button
          type="button"
          className="gray-button"
          onClick={() => {
            setZippingStatus("");
            setStep(2);
          }}
        >
          {content.common.vorige}
        </button>
      </div>
    );
  }

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
