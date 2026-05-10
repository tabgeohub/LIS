import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import JSZip from "jszip";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType, FinishedPointType } from "Types/finished_plans";
import useGetPiloot from "hooks/consts/useGetPiloot";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { runWithConcurrency, preloadLogoDataUrl } from "./utils";
import { safeFetchPointAttachments } from "./attachments";
import { processPoint } from "./processPoint";
import { processGeometry } from "./processGeometry";
import type {
  ProcessPointParams,
  ProcessGeometryParams,
  PreloadPointResult,
  PreloadGeometryResult,
} from "./types";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";

export function useHandleStep2(
  selectedPlan: FinishedFlightPlanType,
  selectedPoints: number[],
  selectedGeometries: number[],
  setZipFile: (zipFile: Blob) => void,
  setZippingStatus: (status: string) => void,
  activities: any,
  organizations: any
) {
  const { graphicsLayer, mapView } = useMapViewState();
  const pilootOptions = useGetPiloot();
  const { selectedBasemap } = useSelectedBasemapState();

  // --- Static map export helper (Topographic MapServer) ---
  const MAPSERVER_URL =
    selectedBasemap === "topo-vector"
      ? "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer"
      : "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";

  return async function handleStep2() {
    if (!graphicsLayer || !mapView || !selectedPlan) return;

    const selectedPointsData = selectedPlan.points_data.filter((p) =>
      selectedPoints.includes(p.id)
    );

    const selectedGeometriesData = (selectedPlan.geometries || []).filter(
      (g) => selectedGeometries.includes(g.id)
    );

    const tempLayer = new GraphicsLayer();
    mapView.map.add(tempLayer);

    const zip = new JSZip();
    const attachmentsFolder = zip.folder("attachments");
    const totalItems = selectedPointsData.length + selectedGeometriesData.length;
    setZippingStatus("Waarnemingsrapporten worden gegenereerd...");

    // Preload attachments for points
    const pointPreloadTasks: (() => Promise<PreloadPointResult>)[] =
      selectedPointsData.map((p) => async () => {
        try {
          const list = await safeFetchPointAttachments(
            ATTACHMENTS_FEATURE_LAYER_URL,
            p as FinishedPointType
          );
          return { pointId: p.id, attachments: list };
        } catch {
          return { pointId: p.id, attachments: [] };
        }
      });

    // Preload attachments for geometries (using first point of each geometry)
    const geometryPreloadTasks: (() => Promise<PreloadGeometryResult>)[] =
      selectedGeometriesData.map((g) => async () => {
        try {
          const firstPoint = g.points?.[0];
          if (!firstPoint) {
            return { geometryId: g.id, attachments: [] };
          }
          const list = await safeFetchPointAttachments(
            ATTACHMENTS_FEATURE_LAYER_URL,
            firstPoint as FinishedPointType
          );
          return { geometryId: g.id, attachments: list };
        } catch {
          return { geometryId: g.id, attachments: [] };
        }
      });

    const [preloadedPoints, preloadedGeometries, logoDataUrl] =
      await Promise.all([
        runWithConcurrency(pointPreloadTasks, 5),
        runWithConcurrency(geometryPreloadTasks, 5),
        preloadLogoDataUrl(),
      ]);

    const attachmentsByPoint = new Map<
      number,
      import("./types").AttachmentWithMeta[]
    >();
    for (const item of preloadedPoints) {
      attachmentsByPoint.set(item.pointId, item.attachments);
    }

    const attachmentsByGeometry = new Map<
      number,
      import("./types").AttachmentWithMeta[]
    >();
    for (const item of preloadedGeometries) {
      attachmentsByGeometry.set(item.geometryId, item.attachments);
    }

    // Process points in parallel
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
        mapServerUrl: MAPSERVER_URL,
        pilootOptions,
        logoDataUrl,
        setZippingStatus,
      } as ProcessPointParams)
    );

    // Process geometries in parallel
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
        mapServerUrl: MAPSERVER_URL,
        pilootOptions,
        logoDataUrl,
        setZippingStatus,
      } as ProcessGeometryParams)
    );

    // Process both points and geometries together
    const allTasks = [...pointTasks, ...geometryTasks];
    const processedItems = await runWithConcurrency(allTasks, 4);

    // Add all processed items to zip
    for (const result of processedItems) {
      zip.file(result.filename, result.pdfData);

      // Create a folder for this item inside the attachments folder
      if (result.attachments.length > 0) {
        const itemFolder = attachmentsFolder?.folder(result.pointName);
        result.attachments.forEach((attr, index) => {
          const extension =
            (attr.blob.type.split("/")[1] || "").split(";")[0] || "bin";
          const filename = `attachment_${index + 1}.${extension}`;
          itemFolder?.file(filename, attr.blob);
        });
      }
    }

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

