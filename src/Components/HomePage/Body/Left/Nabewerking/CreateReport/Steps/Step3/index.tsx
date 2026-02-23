/* eslint-disable react-hooks/exhaustive-deps */
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { useUploadZip } from "./hooks/useUploadZip";
import { useCopyLink } from "./hooks/useCopyLink";
import { useDirectDownload } from "./hooks/useDirectDownload";
import ErrorBanner from "./components/ErrorBanner";
import LoadingPhase from "./components/LoadingPhase";
import SuccessPhase from "./components/SuccessPhase";

export default function Step3() {
  const { zippingStatus, setStep } = useCreateReportState();

  const {
    downloadInfo,
    isUploading,
    errorMsg,
    setErrorMsg,
    fail,
  } = useUploadZip();

  const { handleCopyLink } = useCopyLink(downloadInfo, setErrorMsg, fail);
  const { handleDirectDownload, isDownloading } = useDirectDownload(
    downloadInfo,
    setErrorMsg,
    fail
  );

  // Show "preparing link" only when zipping is done, we started uploading, and no link yet
  const isPreparingLink =
    zippingStatus === "finish." && isUploading && !downloadInfo && !errorMsg;

  return (
    <div>
      <ErrorBanner errorMsg={errorMsg} />

      {!errorMsg && (
        <>
          <LoadingPhase
            zippingStatus={zippingStatus}
            isPreparingLink={isPreparingLink}
          />

          {zippingStatus === "finish." && downloadInfo && (
            <SuccessPhase
              downloadInfo={downloadInfo}
              isDownloading={isDownloading}
              onDirectDownload={handleDirectDownload}
              onCopyLink={handleCopyLink}
              onClose={() => setStep(2)}
            />
          )}
        </>
      )}
    </div>
  );
}
