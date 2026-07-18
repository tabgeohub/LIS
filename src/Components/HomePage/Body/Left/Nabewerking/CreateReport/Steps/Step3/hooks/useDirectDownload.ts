import { useState } from "react";
import toast from "react-hot-toast";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";
import {
  downloadBlobAsFile,
  fetchDirectDownloadBlob,
} from "./directDownloadHelpers";

type UseDirectDownloadInput = {
  downloadInfo: DownloadInfo | null;
  setErrorMsg: (msg: string | null) => void;
  fail: (msg: string) => void;
};

export function useDirectDownload(input: UseDirectDownloadInput) {
  const { downloadInfo, setErrorMsg, fail } = input;
  const content = useContent();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDirectDownload = async () => {
    if (!downloadInfo?.url || isDownloading) return;
    setIsDownloading(true);
    setErrorMsg(null);
    try {
      const directUrl = downloadInfo.url.replace(
        "/api/file-download/",
        "/api/direct-download/"
      );
      const blob = await fetchDirectDownloadBlob(directUrl);
      await downloadBlobAsFile(downloadInfo.filename, blob);
    } catch (e: any) {
      const msg =
        e instanceof Error && e.message.startsWith("Download failed")
          ? e.message
          : content.nabewerking.createReport.step3.toasts.error ||
            "Er is iets misgegaan bij het downloaden.";
      fail(msg);
      toast.error(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDirectDownload, isDownloading };
}
