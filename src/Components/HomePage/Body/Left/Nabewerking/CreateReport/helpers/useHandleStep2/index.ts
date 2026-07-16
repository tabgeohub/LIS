import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import JSZip from "jszip";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { runWithConcurrency } from "./utils";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";
import {
  addProcessedItemsToZip,
  preloadReportAttachments,
} from "./reportZipHelpers";
import { buildReportProcessingTasks } from "./buildReportProcessingTasks";

export type UseHandleStep2Input = {
  selectedPlan: FinishedFlightPlanType;
  selectedPoints: number[];
  selectedGeometries: number[];
  setZipFile: (zipFile: Blob) => void;
  setZippingStatus: (status: string) => void;
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
};

function resolveMapServerUrl(selectedBasemap: string) {
  return selectedBasemap === "topo-vector"
    ? "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer"
    : "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
}

export function useHandleStep2(input: UseHandleStep2Input) {
  const {
    selectedPlan,
    selectedPoints,
    selectedGeometries,
    setZipFile,
    setZippingStatus,
    activities,
    organizations,
  } = input;
  const { mapView } = useMapViewState();
  const pilootOptions = useConstSelectOptions("piloten");
  const { selectedBasemap } = useSelectedBasemapState();
  const mapServerUrl = resolveMapServerUrl(selectedBasemap);

  return async function handleStep2() {
    if (!mapView?.map || !selectedPlan) return;
    const map = mapView.map;

    const selectedPointsData = selectedPlan.points_data.filter((point) =>
      selectedPoints.includes(point.id)
    );
    const selectedGeometriesData = (selectedPlan.geometries || []).filter(
      (geometry) => selectedGeometries.includes(geometry.id)
    );

    const tempLayer = new GraphicsLayer();
    map.add(tempLayer);
    const zip = new JSZip();
    const totalItems = selectedPointsData.length + selectedGeometriesData.length;

    setZippingStatus("Waarnemingsrapporten worden gegenereerd...");

    try {
      const { attachmentsByPoint, attachmentsByGeometry, logoDataUrl } =
        await preloadReportAttachments({
          selectedPointsData,
          selectedGeometriesData,
        });

      const tasks = buildReportProcessingTasks({
        selectedPlan,
        selectedPointsData,
        selectedGeometriesData,
        totalItems,
        activities,
        organizations,
        attachmentsByPoint,
        attachmentsByGeometry,
        featureLayerUrl: ATTACHMENTS_FEATURE_LAYER_URL,
        tempLayer,
        mapServerUrl,
        pilootOptions,
        logoDataUrl,
        setZippingStatus,
      });

      const processedItems = await runWithConcurrency({
        tasks,
        concurrency: 4,
      });

      addProcessedItemsToZip(zip, processedItems);

      setZippingStatus("Bestanden worden ingepakt...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 1 },
      });
      setZipFile(zipBlob);
      setZippingStatus("finish.");
    } catch (err) {
      console.error("Report generation failed:", err);
      setZippingStatus(
        `error:${err instanceof Error ? err.message : "Rapport genereren mislukt"}`
      );
    } finally {
      map.remove(tempLayer);
    }
  };
}
