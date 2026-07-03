import { useGetPiloot } from "hooks/consts/useConstSelectOptions";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import JSZip from "jszip";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { runWithConcurrency } from "./utils";
import { processPoint } from "./processPoint";
import { processGeometry } from "./processGeometry";
import type { ProcessGeometryParams, ProcessPointParams } from "./types";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";
import {
  addProcessedItemsToZip,
  preloadReportAttachments,
} from "./reportZipHelpers";

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
  const pilootOptions = useGetPiloot();
  const { selectedBasemap } = useSelectedBasemapState();
  const mapServerUrl = resolveMapServerUrl(selectedBasemap);

  return async function handleStep2() {
    if (!mapView || !selectedPlan) return;

    const selectedPointsData = selectedPlan.points_data.filter((point) =>
      selectedPoints.includes(point.id)
    );
    const selectedGeometriesData = (selectedPlan.geometries || []).filter(
      (geometry) => selectedGeometries.includes(geometry.id)
    );

    const tempLayer = new GraphicsLayer();
    mapView.map.add(tempLayer);
    const zip = new JSZip();
    const totalItems = selectedPointsData.length + selectedGeometriesData.length;

    setZippingStatus("Waarnemingsrapporten worden gegenereerd...");

    const { attachmentsByPoint, attachmentsByGeometry, logoDataUrl } =
      await preloadReportAttachments({
        selectedPointsData,
        selectedGeometriesData,
      });

    const pointTasks = selectedPointsData.map((point, index) => () =>
      processPoint({
        point,
        index: index + 1,
        totalItems,
        selectedPlan,
        activities,
        organizations,
        attachmentsByPoint,
        featureLayerUrl: ATTACHMENTS_FEATURE_LAYER_URL,
        tempLayer,
        mapServerUrl,
        pilootOptions,
        logoDataUrl,
        setZippingStatus,
      } as ProcessPointParams)
    );

    const geometryTasks = selectedGeometriesData.map((geometry, index) => () =>
      processGeometry({
        geometry,
        index,
        totalItems,
        pointsOffset: selectedPointsData.length,
        selectedPlan,
        activities,
        organizations,
        attachmentsByGeometry,
        featureLayerUrl: ATTACHMENTS_FEATURE_LAYER_URL,
        tempLayer,
        mapServerUrl,
        pilootOptions,
        logoDataUrl,
        setZippingStatus,
      } as ProcessGeometryParams)
    );

    const processedItems = await runWithConcurrency(
      [...pointTasks, ...geometryTasks],
      4
    );

    addProcessedItemsToZip(zip, processedItems);

    setZippingStatus("Bestanden worden ingepakt...");
    mapView.map.remove(tempLayer);
    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 1 },
    });
    setZipFile(zipBlob);
    setZippingStatus("finish.");
  };
}
