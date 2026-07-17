import { useEffect, useState } from "react";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import toast from "react-hot-toast";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";
import { uploadReportZipFile } from "./uploadReportZipFile";

export function useUploadZip() {
  const { zipFile, selectedPlan, zippingStatus } = useCreateReportState();
  const content = useContent();
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function fail(message: string) {
    setErrorMsg(message);
    setIsUploading(false);
  }

  useEffect(() => {
    const uploadZip = async () => {
      if (!zipFile || !selectedPlan) return;

      try {
        setErrorMsg(null);
        setIsUploading(true);
        const result = await uploadReportZipFile({
          zipFile,
          omschrijving: selectedPlan.omschrijving || "report",
        });
        setDownloadInfo(result);
      } catch (error: any) {
        const msg =
          content.nabewerking.createReport.step3.toasts?.error ||
          "Er is iets misgegaan bij het uploaden van het rapport.";
        fail(msg);
        toast.error(msg);
      } finally {
        setIsUploading(false);
      }
    };

    if (zippingStatus === "finish.") {
      uploadZip();
    }
  }, [zippingStatus, zipFile, selectedPlan, content]);

  useEffect(() => {
    return () => {
      if (downloadInfo?.url && downloadInfo.url.startsWith("blob:")) {
        URL.revokeObjectURL(downloadInfo.url);
      }
    };
  }, [downloadInfo]);

  return {
    downloadInfo,
    isUploading,
    errorMsg,
    setErrorMsg,
    fail,
  };
}
