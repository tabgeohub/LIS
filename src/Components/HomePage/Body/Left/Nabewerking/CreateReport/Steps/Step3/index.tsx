/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { FaCopy, FaDownload } from "react-icons/fa6";

type DownloadInfo = {
  url: string;
  filename: string;
};

export default function Step3() {
  const logAction = useLogAction();
  const content = useContent();

  const { zipFile, selectedPlan, zippingStatus, setStep } =
    useCreateReportState();

  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // show “preparing link” only when zipping is done, we started uploading, and no link yet
  const isPreparingLink =
    zippingStatus === "finish." && isUploading && !downloadInfo && !errorMsg;

  function fail(message: string) {
    setErrorMsg(message);
    setIsUploading(false);
    setIsDownloading(false);
  }

  useEffect(() => {
    return () => {
      if (downloadInfo?.url && downloadInfo.url.startsWith("blob:")) {
        URL.revokeObjectURL(downloadInfo.url);
      }
    };
  }, [downloadInfo]);

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
        // Keep toast for quick feedback, but UI shows the same message
        toast.error(msg);
      } finally {
        setIsUploading(false);
      }
    };

    if (zippingStatus === "finish.") {
      uploadZip();
    }
  }, [zippingStatus, zipFile, selectedPlan]);

  const handleCopyLink = async () => {
    if (!downloadInfo?.url) return;

    const password = window.prompt(
      content.nabewerking.createReport.step3.done.passwordPrompt
    );

    if (password == null) return;

    const trimmed = password.trim();
    if (!trimmed) {
      const msg =
        content.nabewerking.createReport.step3.toasts.passwordRequired;
      fail(msg);
      toast.error(msg);
      return;
    }

    try {
      setErrorMsg(null);

      // Extract filename from url: /api/file-download/:filename
      const url = new URL(downloadInfo.url, getBackEndUrl());
      const parts = url.pathname.split("/");
      const filename = parts[parts.length - 1];

      const res = await fetch(
        `${getBackEndUrl()}/api/file-download/${encodeURIComponent(
          filename
        )}/password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: trimmed }),
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Failed to set password (${res.status})`);
      }

      await navigator.clipboard.writeText(downloadInfo.url);
      toast.success(content.nabewerking.createReport.step3.toasts.success);
      logAction({
        message: "User set password and copied link",
        step: "Third step",
      });
    } catch (e: any) {
      const msg =
        e?.message ||
        content.nabewerking.createReport.step3.toasts.error ||
        "Er is iets misgegaan bij het instellen van het wachtwoord.";
      fail(msg);
      toast.error(msg);
    }
  };

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

      const res = await fetch(directUrl);
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

  return (
    <div>
      {/* Error banner (always takes precedence) */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full rounded-md border border-red-300 bg-red-50 text-red-800 px-3 py-2 mb-3"
        >
          {errorMsg}
        </div>
      )}

      {/* Phase 1: generation/packaging in progress – always display animation */}
      {!errorMsg && zippingStatus !== "finish." && (
        <div className="px-3 pt-2 flex flex-col items-center text-center">
          <p className="text-[14px] font-medium mb-2">{zippingStatus}</p>
          <LoadingBars />
          <p className="text-[12px] text-gray-500 mt-2">
            {content?.nabewerking?.createReport?.step3?.progressHint}
          </p>
        </div>
      )}

      {/* Phase 2: zipping finished but link still being prepared/uploaded */}
      {!errorMsg && isPreparingLink && (
        <div className="px-3 pt-2 flex flex-col items-center text-center">
          <p className="text-[14px] font-medium mb-2">
            {content.nabewerking.createReport.step3.preparingLink}
          </p>
          <LoadingBars />
          <p className="text-[12px] text-gray-500 mt-2">
            {content?.nabewerking?.createReport?.step3?.uploadingHint}
          </p>
        </div>
      )}

      {/* Phase 3: ready to download / copy link */}
      {!errorMsg && zippingStatus === "finish." && downloadInfo && (
        <div className="flex flex-col items-start p-4">
          <p className="text-[14px]">
            {content.nabewerking.createReport.step3.done.instruction}
          </p>

          <div className="flex flex-col my-4 space-y-3">
            <button
              onClick={handleDirectDownload}
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
              onClick={handleCopyLink}
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
              setStep(2);
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
      )}
    </div>
  );
}
