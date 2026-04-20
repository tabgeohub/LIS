import { ActionType } from "../..";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import shpwrite from "@mapbox/shp-write";
import { FeatureCollection, LineString } from "geojson";
import JSZip from "jszip";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

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

    const zip = new JSZip();
    const plan = selectedPlan as FinishedFlightPlanType;

    const coords: [number, number][] = plan.path.map((pt) => [
      pt.longitude,
      pt.latitude,
    ]);

    const geojsonFlightPath: FeatureCollection<LineString> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coords,
          },
          properties: {
            id: plan.id,
            name: plan.vluchtnummer,
            date: plan.datum,
          },
        },
      ],
    };

    const flightPathZip = shpwrite.zip(geojsonFlightPath, {
      compression: "DEFLATE",
      outputType: "blob",
    });

    zip.file("path.zip", flightPathZip);
    const finalZipBlob = await zip.generateAsync({ type: "blob" });
    const filename = `path_${plan.vluchtnummer}.zip`;

    const formData = new FormData();
    formData.append("report", finalZipBlob, filename);

    try {
      const res = await fetch(`${getBackEndUrl()}/api/upload-report`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      setDownloadInfo({ url: result.url, filename });
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
