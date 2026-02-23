import { FaCopy, FaDownload } from "react-icons/fa6";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import type { DownloadInfo } from "../types";

interface SuccessPhaseProps {
  downloadInfo: DownloadInfo;
  isDownloading: boolean;
  onDirectDownload: () => void;
  onCopyLink: () => void;
  onClose: () => void;
}

export default function SuccessPhase({
  downloadInfo,
  isDownloading,
  onDirectDownload,
  onCopyLink,
  onClose,
}: SuccessPhaseProps) {
  const content = useContent();
  const logAction = useLogAction();

  return (
    <div className="flex flex-col items-start p-4">
      <p className="text-[14px]">
        {content.nabewerking.createReport.step3.done.instruction}
      </p>

      <div className="flex flex-col my-4 space-y-3">
        <button
          onClick={onDirectDownload}
          disabled={isDownloading}
          aria-busy={isDownloading}
          className={`gray-button flex items-center justify-between w-[210px] !px-3 !text-[14px] ${
            isDownloading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <span className="flex items-center gap-2">
            {isDownloading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  strokeWidth="2"
                  opacity="0.25"
                />
                <path
                  d="M21 12a9 9 0 0 1-9 9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {isDownloading
              ? content.nabewerking.createReport.step3.downloading
              : content.nabewerking.createReport.step3.done.downloadText}
          </span>
          {!isDownloading && <FaDownload />}
        </button>

        <button
          onClick={onCopyLink}
          disabled={!downloadInfo?.url}
          className={`gray-button flex items-center justify-between w-[210px] !px-3 !text-[14px] ${
            !downloadInfo?.url ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span>
            {content.nabewerking.createReport.step3.done.buttons.copyLink}
          </span>
          <FaCopy />
        </button>
      </div>

      <button
        onClick={() => {
          onClose();
          logAction({
            message: "User clicked 'Previous' button",
            step: "Third step",
          });
        }}
        className="gray-button ml-auto"
      >
        {content.nabewerking.createReport.step3.done.buttons.close}
      </button>
    </div>
  );
}



