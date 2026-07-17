import { ActionType } from "../..";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import {
  buildFlightPathZipBlob,
  uploadFlightPathZip,
} from "./exportFlightPathZip";

export default function VliegrouteExporteren({
  setAction,
}: {
  setAction: (value: ActionType) => void;
}) {
  const logAction = useLogAction();

  const { selectedPlan } = useFinishedPlansState();

  const [downloadInfo, setDownloadInfo] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (downloadInfo) {
        URL.revokeObjectURL(downloadInfo.url);
      }
    };
  }, [downloadInfo]);

  const content = useContent();

  const exportFlightPath = async (): Promise<void> => {
    if (!selectedPlan) return;

    if (selectedPlan.path === null || selectedPlan.path === undefined) return;

    if (selectedPlan.path.length === 0) {
      console.error("No flight path data available.");
      return;
    }

    try {
      const { blob, filename } = await buildFlightPathZipBlob(
        selectedPlan as FinishedFlightPlanType
      );
      const result = await uploadFlightPathZip({ blob, filename });
      setDownloadInfo(result);
    } catch (error) {
      toast.error(
        content.nabewerking.vluchtenZoeken.step2.exportFlightPath.toasts
          .uploadFailed
      );
    }
  };

  const handleCopyLink = () => {
    if (downloadInfo?.url) {
      navigator.clipboard.writeText(downloadInfo.url);
      toast.success(
        content.nabewerking.vluchtenZoeken.step2.exportFlightPath.toasts
          .copySuccess
      );
    }
  };

  return (
    <div>
      {!downloadInfo && (
        <>
          <div className="text-sm text-gray-500">
            {content.nabewerking.vluchtenZoeken.step2.exportFlightPath.readyText.replace(
              "{vluchtnummer}",
              String(selectedPlan?.vluchtnummer)
            )}
          </div>

          <div className="flex justify-end gap-x-2 mt-6">
            <button
              onClick={() => {
                setAction("none");

                logAction({
                  message: "User clicked 'Previous' button",
                  step: "Second step - Export flight path",
                });
              }}
              className="gray-button"
            >
              {content.common.vorige}
            </button>

            <button
              onClick={() => {
                exportFlightPath();

                logAction({
                  message: "User clicked 'Export flight path' button",
                  step: "Second step - Export flight path",
                });
              }}
              className="gray-button"
            >
              {
                content.nabewerking.vluchtenZoeken.step2.exportFlightPath
                  .buttons.export
              }
            </button>
          </div>
        </>
      )}

      {downloadInfo && (
        <div className="text-sm text-gray-500">
          <div>
            {
              content.nabewerking.vluchtenZoeken.step2.exportFlightPath
                .afterUploadInstruction
            }
          </div>
          <a
            href={downloadInfo.url}
            download={downloadInfo.filename}
            className="text-blue-600 underline mt-6 text-[10px]"
          >
            {
              content.nabewerking.vluchtenZoeken.step2.exportFlightPath
                .downloadLinkText
            }
          </a>

          <div className="flex justify-end gap-x-2 mt-2">
            <button
              onClick={() => {
                handleCopyLink();

                logAction({
                  message: "User clicked 'Copy link' button",
                  step: "Second step - Export flight path",
                });
              }}
              className="gray-button"
            >
              {
                content.nabewerking.vluchtenZoeken.step2.exportFlightPath
                  .buttons.copyLink
              }
            </button>
            <button
              onClick={() => {
                setAction("none");

                logAction({
                  message: "User clicked 'Previous' button",
                  step: "Second step - Export flight path",
                });
              }}
              className="gray-button"
            >
              {content.common.vorige}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
