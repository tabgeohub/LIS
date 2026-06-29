import { useState } from "react";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import * as XLSX from "@e965/xlsx";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useCreateData } from "utils/useCreateData";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";

import { PointImportRow } from "@helpers/points/pointColumnKeys";

type PointRow = PointImportRow;

type BulkImportResponse = {
  ok: boolean;
  created: number;
  existing: number;
  total: number;
  points: Array<PointRow & { id: number | null }>;
  message?: string;
};

export default function ImportVluchtPlan() {
  const [showExcel, setShowExcel] = useState(false);
  const organizations = useGetOrganisaties();

  const { setSelectedPoints, setSelectedPoints2 } = useFlightPlanState();

  const { resetFeatures } = useResetFeatures();
  const { user } = useAuth();
  const logAction = useLogAction();

  const content = useContent();

  const { create } = useCreateData<{ rows: PointRow[] }, BulkImportResponse>(
    "/points/import"
  );

  const orgMap = new Map(
    organizations.map(({ label, value }) => [label.trim().toLowerCase(), value])
  );

  function getOrgValueFromLabel(rawLabel: string): string {
    const cleanLabel = String(rawLabel ?? "")
      .replace(/[\n\r"]/g, "")
      .trim()
      .toLowerCase();
    return orgMap.get(cleanLabel) ?? "";
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();
    const isCSV =
      fileName.endsWith(".csv.xls") ||
      fileName.endsWith(".csv") ||
      fileName.endsWith(".csv.xlsx");

    reader.onload = async (event) => {
      if (!event.target?.result) return;

      let rows: string[][] = [];

      if (isCSV) {
        const decoder = new TextDecoder("windows-1252");
        const text = decoder.decode(event.target.result as ArrayBuffer);
        const delimiter = ";";
        const lines = text.split(/\r?\n/);
        const expectedFieldCount = lines[0]?.split(delimiter).length ?? 0;
        let buffer = "";

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line?.trim()) continue;

          buffer += (buffer ? "\n" : "") + line;
          const fields = buffer.split(delimiter);

          if (fields.length === expectedFieldCount) {
            rows.push(fields.map((f) => f.trim()));
            buffer = "";
          }
        }
      } else {
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      }

      if (rows.length < 2) {
        console.warn("File is missing required data");
        toast.error(
          content.voorbereiding.vluchtAanmaken.step1.toasts.fileMissingData
        );
        return;
      }

      const pointHeaders = rows[0];
      const pointObjects: PointRow[] = rows
        .slice(1)
        .map((row) => {
          const obj: PointRow = {
            omschrijving: "",
            regio_id: "",
            xcoordinaat_rd: 0,
            ycoordinaat_rd: 0,
            latitude: 0,
            longitude: 0,
            herhalen: 0,
            vertrouwelijk: 0,
            user_id: String(user.user_id),
            activiteit_id: "",
            organisatie_id: "",
            specifiek_letten_op: "",
          };

          pointHeaders.forEach((key, i) => {
            const value = row[i];

            switch (key) {
              case "omschrijving":
                obj.omschrijving = String(value || "").trim();
                break;

              case "regio_id":
                obj.regio_id = String(value || "").trim();
                break;

              case "xcoordinaat_rd":
              case "ycoordinaat_rd":
              case "latitude":
              case "longitude": {
                const raw = String(value || "").trim();
                const normalized = raw.replace(",", ".").replace(/\s/g, "");
                const parsed = parseFloat(normalized);

                obj[key] = isNaN(parsed) ? 0 : parsed;
                break;
              }

              case "herhalen":
              case "vertrouwelijk":
                obj[key] = value ?? 0;
                break;

              case "activiteit_id":
                obj.activiteit_id = String(
                  (value ?? "")
                    .toString()
                    .replace(/[\n\r"]/g, "")
                    .trim()
                    .toLowerCase()
                );
                break;

              case "organisatie_id":
                obj.organisatie_id = String(getOrgValueFromLabel(value)).trim();
                break;

              case "specifiek_letten_op":
                obj.specifiek_letten_op = String(value || "").trim();
                break;

              default:
                break;
            }
          });

          return obj;
        })
        .filter((p) => p.omschrijving !== "");

      if (pointObjects.length === 0) {
        toast.error(
          content.voorbereiding.vluchtAanmaken.step1.toasts.noValidRows
        );
        return;
      }

      try {
        await create(
          { rows: pointObjects },
          (resp) => {
            const points = resp.points;

            if (points.length === 0) return;

            const herhalenPoints = points.filter((p) => p.herhalen === "ja");
            const nietHerhalenPoints = points.filter(
              (p) => p.herhalen === "nee"
            );

            if (resp.ok) {
              toast.success(
                content.voorbereiding.vluchtAanmaken.step1.toasts.importCompleted
                  .replace("{created}", String(resp.created))
                  .replace("{existing}", String(resp.existing))
              );

              setSelectedPoints(herhalenPoints.map((p) => p.id) as number[]);
              setSelectedPoints2(
                nietHerhalenPoints.map((p) => p.id) as number[]
              );
            } else {
              toast.error(
                resp.message ??
                  content.voorbereiding.vluchtAanmaken.step1.toasts.importFailed
              );
            }
          },
          false,
          true
        );

        resetFeatures();
      } catch (e: any) {
        toast.error(
          e?.message ??
            content.voorbereiding.vluchtAanmaken.step1.toasts.fetchError
        );
      }
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
