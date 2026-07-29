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

function toDirectDownloadUrl(fileDownloadUrl: string): string {
  return fileDownloadUrl.replace(
    "/api/file-download/",
    "/api/direct-download/"
  );
}

function resolveDownloadErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error && error.message.startsWith("Download failed")) {
    return error.message;
  }
  return fallback;
}

export function useDirectDownload(input: UseDirectDownloadInput) {
  const { downloadInfo, setErrorMsg, fail } = input;
  const content = useContent();
  const [isDownloading, setIsDownloading] = useState(false);
  const fallbackError =
    content.nabewerking.createReport.step3.toasts.error ||
    "Er is iets misgegaan bij het downloaden.";

  const handleDirectDownload = async () => {
    if (!downloadInfo?.url || isDownloading) return;
    setIsDownloading(true);
    setErrorMsg(null);
    try {
      const blob = await fetchDirectDownloadBlob(
        toDirectDownloadUrl(downloadInfo.url)
      );
      await downloadBlobAsFile(downloadInfo.filename, blob);
    } catch (e: any) {
      const msg = resolveDownloadErrorMessage(e, fallbackError);
      fail(msg);
      toast.error(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDirectDownload, isDownloading };
}
