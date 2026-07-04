import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useState } from "react";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useCreateData } from "utils/useCreateData";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useContent } from "hooks/useContent";
import { PointImportRow } from "@helpers/points/pointColumnKeys";
import {
  isCsvFileName,
  mapImportRowsToPoints,
  parseCsvRows,
  parseExcelRows,
  splitImportedPointIds,
} from "../../helpers/parsePointImportFile";

type BulkImportResponse = {
  ok: boolean;
  created: number;
  existing: number;
  total: number;
  points: Array<PointImportRow & { id: number | null }>;
  message?: string;
};

export default function ImportVluchtPlan() {
  const [showExcel, setShowExcel] = useState(false);
  const organizations = useConstSelectOptions("organisaties");
  const { setSelectedPoints, setSelectedPoints2 } = useFlightPlanState();
  const { resetFeatures } = useResetFeatures();
  const { user } = useAuth();
  const logAction = useLogAction();
  const content = useContent();
  const { create } = useCreateData<{ rows: PointImportRow[] }, BulkImportResponse>(
    "/points/import"
  );

  const orgMap = new Map(
    organizations.map(({ label, value }) => [label.trim().toLowerCase(), value])
  );

  function resolveOrgValue(rawLabel: string): string {
    const cleanLabel = String(rawLabel ?? "")
      .replace(/[\n\r"]/g, "")
      .trim()
      .toLowerCase();
    return orgMap.get(cleanLabel) ?? "";
  }

  async function processImportedRows(rows: string[][]) {
    const pointObjects = mapImportRowsToPoints({
      rows,
      userId: String(user.user_id),
      resolveOrgValue,
    });

    if (pointObjects.length === 0) {
      toast.error(content.voorbereiding.vluchtAanmaken.step1.toasts.noValidRows);
      return;
    }

    try {
      await create({
        data: { rows: pointObjects },
        onSuccess: (resp) => {
          if (resp.points.length === 0) return;

          if (!resp.ok) {
            toast.error(
              resp.message ??
                content.voorbereiding.vluchtAanmaken.step1.toasts.importFailed
            );
            return;
          }

          toast.success(
            content.voorbereiding.vluchtAanmaken.step1.toasts.importCompleted
              .replace("{created}", String(resp.created))
              .replace("{existing}", String(resp.existing))
          );

          const { herhalen, nietHerhalen } = splitImportedPointIds(resp.points);
          setSelectedPoints(herhalen);
          setSelectedPoints2(nietHerhalen);
        },
        disableErrorMessage: true,
        disableSuccessMessage: true,
      });
      resetFeatures();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : undefined;
      toast.error(
        message ?? content.voorbereiding.vluchtAanmaken.step1.toasts.fetchError
      );
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isCsv = isCsvFileName(file.name.toLowerCase());

    reader.onload = async (event) => {
      if (!event.target?.result) return;

      const rows = isCsv
        ? parseCsvRows(
            new TextDecoder("windows-1252").decode(event.target.result as ArrayBuffer)
          )
        : parseExcelRows(event.target.result as ArrayBuffer);

      if (rows.length < 2) {
        toast.error(
          content.voorbereiding.vluchtAanmaken.step1.toasts.fileMissingData
        );
        return;
      }

      await processImportedRows(rows);
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <div>
      <div className="flex gap-x-2 items-center">
        <button
          className="flex gap-x-2 items-center gray-button"
          onClick={() => {
            setShowExcel(true);
            logAction({
              message: "User clicked 'Import' button",
              step: "First step",
            });
          }}
        >
          <PiMicrosoftExcelLogoFill className="text-blue-500 my-auto text-xl" />
          {content.voorbereiding.vluchtAanmaken.step1.puntentImport}
        </button>
      </div>

      <div className="p-4">
        {showExcel && (
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="gray-button pt-2"
          />
        )}
      </div>
    </div>
  );
}
