import { useState } from "react";
import toast from "react-hot-toast";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";

export function useDirectDownload(
  downloadInfo: DownloadInfo | null,
  setErrorMsg: (msg: string | null) => void,
  fail: (msg: string) => void
) {
  const content = useContent();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDirectDownload = async () => {
    if (!downloadInfo?.url || isDownloading) return;

    setIsDownloading(true);
    setErrorMsg(null);
    try {
      const filename = downloadInfo.filename;
      const directUrl = downloadInfo.url.replace(
        "/api/file-download/",
        "/api/direct-download/"
      );

      const res = await fetch(directUrl, {
        credentials: "include",
      });
      if (!res.ok) {
        const msg = `Download failed (${res.status})`;
        fail(msg);
        toast.error(msg);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      const msg =
        content.nabewerking.createReport.step3.toasts.error ||
        "Er is iets misgegaan bij het downloaden.";
      fail(msg);
      toast.error(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDirectDownload, isDownloading };
}



