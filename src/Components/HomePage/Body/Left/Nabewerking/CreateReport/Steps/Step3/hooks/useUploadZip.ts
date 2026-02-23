import { useEffect, useState } from "react";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import toast from "react-hot-toast";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";

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

      const formData = new FormData();
      const rawName = `${selectedPlan.omschrijving || "report"}`.trim();
      // @ts-ignore – unicode safe replace
      const safeName = rawName.replace(/[^\p{L}\p{N}\s._-]+/gu, "_");
      const filename = `${safeName}.zip`;
      formData.append("report", zipFile, filename);

      try {
        setErrorMsg(null);
        setIsUploading(true);

        const res = await fetch(`${getBackEndUrl()}/api/upload-report`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || `Upload failed (${res.status})`);
        }

        const result = await res.json().catch(() => ({} as any));
        if (!result?.url || typeof result.url !== "string") {
          throw new Error("Bad response from server (missing url)");
        }

        setDownloadInfo({ url: result.url, filename });
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

  // Cleanup blob URLs
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



