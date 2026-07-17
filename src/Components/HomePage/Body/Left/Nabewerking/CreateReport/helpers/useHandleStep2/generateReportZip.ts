import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import JSZip from "jszip";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { runWithConcurrency } from "./utils";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";
import {
  addProcessedItemsToZip,
  preloadReportAttachments,
} from "./reportZipHelpers";
import { buildReportProcessingTasks } from "./buildReportProcessingTasks";

export async function generateReportZip(input: {
  map: __esri.Map;
  selectedPlan: FinishedFlightPlanType;
  selectedPoints: number[];
  selectedGeometries: number[];
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  setZipFile: (zipFile: Blob) => void;
  setZippingStatus: (status: string) => void;
}): Promise<void> {
  const selectedPointsData = input.selectedPlan.points_data.filter((point) =>
    input.selectedPoints.includes(point.id)
  );
  const selectedGeometriesData = (input.selectedPlan.geometries || []).filter(
    (geometry) => input.selectedGeometries.includes(geometry.id)
  );

  const tempLayer = new GraphicsLayer();
  input.map.add(tempLayer);
  const zip = new JSZip();
  const totalItems =
    selectedPointsData.length + selectedGeometriesData.length;

  input.setZippingStatus("Waarnemingsrapporten worden gegenereerd...");

  try {
    const { attachmentsByPoint, attachmentsByGeometry, logoDataUrl } =
      await preloadReportAttachments({
        selectedPointsData,
        selectedGeometriesData,
      });

    const tasks = buildReportProcessingTasks({
      selectedPlan: input.selectedPlan,
      selectedPointsData,
      selectedGeometriesData,
      totalItems,
      activities: input.activities,
      organizations: input.organizations,
      attachmentsByPoint,
      attachmentsByGeometry,
      featureLayerUrl: ATTACHMENTS_FEATURE_LAYER_URL,
      tempLayer,
      mapServerUrl: input.mapServerUrl,
      pilootOptions: input.pilootOptions,
      logoDataUrl,
      setZippingStatus: input.setZippingStatus,
    });

    const processedItems = await runWithConcurrency({
      tasks,
      concurrency: 4,
    });

    addProcessedItemsToZip(zip, processedItems);

    input.setZippingStatus("Bestanden worden ingepakt...");
    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 1 },
    });
    input.setZipFile(zipBlob);
    input.setZippingStatus("finish.");
  } catch (err) {
    console.error("Report generation failed:", err);
    input.setZippingStatus(
      `error:${err instanceof Error ? err.message : "Rapport genereren mislukt"}`
    );
  } finally {
    input.map.remove(tempLayer);
  }
}
