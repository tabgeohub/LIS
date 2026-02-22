/* eslint-disable no-useless-escape */
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { generatePdfReport } from "../helpers/generatePdfReport";
import JSZip from "jszip";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { PDFPointDataType } from "Types";
import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";
import useGetPiloot from "hooks/consts/useGetPiloot";
import { refreshToken } from "@helpers/refreshToken";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 2
): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 401 || res.status === 498) {
        try {
          await refreshToken();
        } catch {}
        lastErr = new Error(`Auth ${res.status}`);
      } else if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
      } else {
        return res;
      }
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
  }
  throw lastErr;
}

async function fetchAttachmentsForPoint(
  featureLayerUrl: string,
  objectId: number
): Promise<{ name: string; blob: Blob }[]> {
  let token = localStorage.getItem("credential_token");
  if (!token) {
    try {
      await refreshToken();
      token = localStorage.getItem("credential_token");
    } catch {}
  }

  const metaUrl = `${featureLayerUrl}/0/${objectId}/attachments?f=json${
    token ? `&token=${token}` : ""
  }`;
  const metadataRes = await fetchWithRetry(metaUrl);
  const metadata = await metadataRes.json();

  if (!metadata.attachmentInfos) return [];

  const attachments = await Promise.allSettled(
    metadata.attachmentInfos.map(async (att: any) => {
      const url = `${featureLayerUrl}/0/${objectId}/attachments/${att.id}${
        token ? `?token=${token}` : ""
      }`;
      const fileRes = await fetchWithRetry(url);
      const blob = await fileRes.blob();

      return { name: att.name || `attachment_${att.id}`, blob };
    })
  );

  const ok = attachments
    .filter(
      (r): r is PromiseFulfilledResult<{ name: string; blob: Blob }> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  return ok;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const current = nextIndex++;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, worker);
  await Promise.all(workers);
  return results;
}

async function preloadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${window.location.origin}/logo.png`);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function safeFetchPointAttachments(
  featureLayerUrl: string,
  point: FinishedPointType
): Promise<{ name: string; blob: Blob }[]> {
  const first = point.attachments?.[0];
  if (first && (first as any)?.attachmentid) {
    try {
      return await fetchAttachmentsForPoint(
        featureLayerUrl,
        (first as any).attachmentid as number
      );
    } catch {}
  }

  if (Array.isArray(point.attachments) && point.attachments.length > 0) {
    const list = point.attachments
      .map((att: any) => att?.url)
      .filter((u: string | undefined) => typeof u === "string" && u.length > 0);

    const results = await Promise.allSettled(
      list.map(async (rawUrl: string) => {
        let token = localStorage.getItem("credential_token");
        if (!token) {
          try {
            await refreshToken();
            token = localStorage.getItem("credential_token");
          } catch {}
        }
        const needsToken = token && /arcgis\.com/.test(rawUrl);
        const finalUrl = needsToken
          ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}token=${token}`
          : rawUrl;
        const res = await fetchWithRetry(finalUrl);
        const blob = await res.blob();
        const nameFromUrl = (() => {
          try {
            const u = new URL(rawUrl);
            return decodeURIComponent(
              u.pathname.split("/").pop() || "attachment"
            );
          } catch {
            return "attachment";
          }
        })();
        return { name: nameFromUrl, blob };
      })
    );

    const ok = results
      .filter(
        (r): r is PromiseFulfilledResult<{ name: string; blob: Blob }> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);
    return ok;
  }

  return [];
}

const RES_BY_LEVEL: Record<number, number> = {
  0: 156543.03392800014,
  1: 78271.51696399994,
  2: 39135.75848200009,
  3: 19567.87924099992,
  4: 9783.93962049996,
  5: 4891.96981024998,
  6: 2445.98490512499,
  7: 1222.992452562495,
  8: 611.4962262813797,
  9: 305.74811314055756,
  10: 152.87405657041106,
  11: 76.43702828507324,
  12: 38.21851414253662,
  13: 19.10925707126831,
  14: 9.554628535634155,
  15: 4.77731426794937,
  16: 2.388657133974685,
  17: 1.1943285668550503,
  18: 0.5971642835598172,
  19: 0.29858214164761665,
  20: 0.14929107082380833,
  21: 0.07464553541190416,
  22: 0.03732276770595208,
  23: 0.01866138385297604,
};

function lonLatToWebMercator(lon: number, lat: number) {
  const x = (lon * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
}

async function getStaticMapImage(
  lon: number,
  lat: number,
  level: number,
  width: number,
  height: number,
  mapserverUrl: string
): Promise<ImageData> {
  const res = RES_BY_LEVEL[level] || RES_BY_LEVEL[10];
  const { x, y } = lonLatToWebMercator(lon, lat);
  const halfW = (res * width) / 2;
  const halfH = (res * height) / 2;
  const xmin = x - halfW;
  const ymin = y - halfH;
  const xmax = x + halfW;
  const ymax = y + halfH;

  const url = `${mapserverUrl}/export?bbox=${xmin},${ymin},${xmax},${ymax}&bboxSR=3857&size=${width},${height}&format=png32&dpi=96&f=image`;
  const resp = await fetchWithRetry(url, {}, 2);
  const blob = await resp.blob();

  const bmp = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0, width, height);
  // draw marker at center (higher contrast)
  ctx.fillStyle = "#ff8c00";
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  return ctx.getImageData(0, 0, width, height);
}

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

  // Helper function to calculate geometry centroid
  function calculateGeometryCentroid(geometry: FinishedGeometryType): {
    longitude: number;
    latitude: number;
  } | null {
    if (!geometry.points || geometry.points.length === 0) return null;

    const sum = geometry.points.reduce(
      (acc, point) => {
        acc.lon += point.longitude;
        acc.lat += point.latitude;
        return acc;
      },
      { lon: 0, lat: 0 }
    );

    return {
      longitude: sum.lon / geometry.points.length,
      latitude: sum.lat / geometry.points.length,
    };
  }

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

    const featureLayerUrl =
      "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer";

    // Preload attachments for points
    const pointPreloadTasks: (() => Promise<{
      pointId: number;
      attachments: { name: string; blob: Blob }[];
    }>)[] = selectedPointsData.map((p) => async () => {
      try {
        const list = await safeFetchPointAttachments(
          featureLayerUrl,
          p as FinishedPointType
        );
        return { pointId: p.id, attachments: list };
      } catch {
        return { pointId: p.id, attachments: [] };
      }
    });

    // Preload attachments for geometries (using first point of each geometry)
    const geometryPreloadTasks: (() => Promise<{
      geometryId: number;
      attachments: { name: string; blob: Blob }[];
    }>)[] = selectedGeometriesData.map((g) => async () => {
      try {
        const firstPoint = g.points?.[0];
        if (!firstPoint) {
          return { geometryId: g.id, attachments: [] };
        }
        const list = await safeFetchPointAttachments(
          featureLayerUrl,
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
      { name: string; blob: Blob }[]
    >();
    for (const item of preloadedPoints as {
      pointId: number;
      attachments: { name: string; blob: Blob }[];
    }[]) {
      attachmentsByPoint.set(item.pointId, item.attachments);
    }

    const attachmentsByGeometry = new Map<
      number,
      { name: string; blob: Blob }[]
    >();
    for (const item of preloadedGeometries as {
      geometryId: number;
      attachments: { name: string; blob: Blob }[];
    }[]) {
      attachmentsByGeometry.set(item.geometryId, item.attachments);
    }

    // Process points in parallel batches for better performance
    const processPoint = async (
      point: typeof selectedPointsData[0],
      index: number
    ): Promise<{
      filename: string;
      pdfData: ArrayBuffer;
      attachments: { name: string; blob: Blob }[];
      pointName: string;
    }> => {
      setZippingStatus(
        `Rapport ${index + 1} van ${totalItems} wordt gegenereerd: '${
          point.omschrijving
        }'`
      );

      const geometry = new Point({
        latitude: point.latitude,
        longitude: point.longitude,
      });

      const symbol = new SimpleMarkerSymbol({
        color: [255, 140, 0, 1],
        size: 10,
        outline: { color: [0, 0, 0, 1], width: 1 },
      });

      const graphic = new Graphic({ geometry, symbol });
      tempLayer.removeAll();
      tempLayer.add(graphic);

      // Parallelize map image fetching (Approach 1)
      const [overviewImage, detailImage] = await Promise.all([
        getStaticMapImage(
          point.longitude,
          point.latitude,
          10,
          1600,
          900,
          MAPSERVER_URL
        ),
        getStaticMapImage(
          point.longitude,
          point.latitude,
          17,
          1600,
          900,
          MAPSERVER_URL
        ),
      ]);

      const pointData: PDFPointDataType = {
        datum: selectedPlan.datum,
        piloot: selectedPlan.piloot,
        waarnemer: selectedPlan.waarnemer,
        luchtvaartuig: selectedPlan.luchtvaartuig,
        hoofdthema: selectedPlan.hoofdthema,
        organisatie:
          organizations.find((org: any) => org.value === point.organisatie_id)
            ?.label || "",
        activiteit:
          activities.find((act: any) => act.value === point.activiteit_id)
            ?.label || "",
        regio: point.regio_id,
        omschrijving: point.omschrijving,
        aanvullende: point.id,
        rdX: point.xcoordinaat_rd,
        rdY: point.ycoordinaat_rd,
        long: point.longitude,
        lat: point.latitude,
      };

      const safeName = pointData.omschrijving
        .replace(/[^\w\s\-]/g, "_")
        .replace(/\s+/g, "_");

      let attachments = attachmentsByPoint.get(point.id) || [];
      if (
        (!attachments || attachments.length === 0) &&
        Array.isArray(point.attachments) &&
        point.attachments.length > 0
      ) {
        try {
          attachments = await safeFetchPointAttachments(
            featureLayerUrl,
            point as FinishedPointType
          );
        } catch {
          attachments = [];
        }
      }

      const pdfData = await generatePdfReport(
        pointData,
        overviewImage,
        detailImage,
        pilootOptions,
        attachments,
        logoDataUrl || undefined
      );
      const arrayBuffer = await pdfData.arrayBuffer();

      return {
        filename: `Waarnemingsrapport_Point_${safeName}.pdf`,
        pdfData: arrayBuffer,
        attachments,
        pointName: safeName,
      };
    };

    // Process geometries similar to points
    const processGeometry = async (
      geometry: FinishedGeometryType,
      index: number
    ): Promise<{
      filename: string;
      pdfData: ArrayBuffer;
      attachments: { name: string; blob: Blob }[];
      pointName: string; // Use same property name as processPoint for consistency
    }> => {
      const currentIndex = selectedPointsData.length + index + 1;
      setZippingStatus(
        `Rapport ${currentIndex} van ${totalItems} wordt gegenereerd: '${
          geometry.geometry_omschrijving || `Geometrie ${geometry.id}`
        }'`
      );

      // Get first point for data (attachments, comment, etc.)
      const firstPoint = geometry.points?.[0];
      if (!firstPoint) {
        throw new Error("Geometry has no points");
      }

      // Calculate centroid for map image centering
      const centroid = calculateGeometryCentroid(geometry);
      if (!centroid) {
        throw new Error("Could not calculate geometry centroid");
      }

      // Create a graphic for the geometry (for map rendering)
      let geometryGraphic: Graphic | null = null;
      if (geometry.geometry_type === "polygon") {
        const coordinates = geometry.points.map((point) => [
          point.longitude,
          point.latitude,
        ]);
        const ring = [...coordinates];
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          ring.push([first[0], first[1]]);
        }

        const polygon = new Polygon({
          rings: [ring],
          spatialReference: { wkid: 4326 },
        });

        const symbol = new SimpleFillSymbol({
          color: [255, 140, 0, 0.5],
          outline: { color: [255, 140, 0, 1], width: 2 },
        });

        geometryGraphic = new Graphic({ geometry: polygon, symbol });
      } else if (geometry.geometry_type === "line") {
        const coordinates = geometry.points.map((point) => [
          point.longitude,
          point.latitude,
        ]);

        const polyline = new Polyline({
          paths: [coordinates],
          spatialReference: { wkid: 4326 },
        });

        const symbol = new SimpleLineSymbol({
          color: [255, 140, 0, 1],
          width: 3,
        });

        geometryGraphic = new Graphic({ geometry: polyline, symbol });
      }

      if (geometryGraphic) {
        tempLayer.removeAll();
        tempLayer.add(geometryGraphic);
      }

      // Parallelize map image fetching centered on centroid
      const [overviewImage, detailImage] = await Promise.all([
        getStaticMapImage(
          centroid.longitude,
          centroid.latitude,
          10,
          1600,
          900,
          MAPSERVER_URL
        ),
        getStaticMapImage(
          centroid.longitude,
          centroid.latitude,
          17,
          1600,
          900,
          MAPSERVER_URL
        ),
      ]);

      // Use first point's data for the report
      const geometryData: PDFPointDataType = {
        datum: selectedPlan.datum,
        piloot: selectedPlan.piloot,
        waarnemer: selectedPlan.waarnemer,
        luchtvaartuig: selectedPlan.luchtvaartuig,
        hoofdthema: selectedPlan.hoofdthema,
        organisatie:
          organizations.find(
            (org: any) => org.value === firstPoint.organisatie_id
          )?.label || "",
        activiteit:
          activities.find(
            (act: any) => act.value === firstPoint.activiteit_id
          )?.label || "",
        regio: firstPoint.regio_id,
        omschrijving:
          geometry.geometry_omschrijving || `Geometrie ${geometry.id}`,
        aanvullende: geometry.id,
        rdX: firstPoint.xcoordinaat_rd,
        rdY: firstPoint.ycoordinaat_rd,
        long: centroid.longitude,
        lat: centroid.latitude,
      };

      const safeName = geometryData.omschrijving
        .replace(/[^\w\s\-]/g, "_")
        .replace(/\s+/g, "_");

      // Get attachments from preloaded data or fetch if needed
      let attachments = attachmentsByGeometry.get(geometry.id) || [];
      if (
        (!attachments || attachments.length === 0) &&
        firstPoint.attachments &&
        firstPoint.attachments.length > 0
      ) {
        try {
          attachments = await safeFetchPointAttachments(
            featureLayerUrl,
            firstPoint as FinishedPointType
          );
        } catch {
          attachments = [];
        }
      }

      const pdfData = await generatePdfReport(
        geometryData,
        overviewImage,
        detailImage,
        pilootOptions,
        attachments,
        logoDataUrl || undefined
      );
      const arrayBuffer = await pdfData.arrayBuffer();

      return {
        filename: `Waarnemingsrapport_Geometry_${safeName}.pdf`,
        pdfData: arrayBuffer,
        attachments,
        pointName: safeName, // Use same property name as processPoint
      };
    };

    // Process points in parallel (Approach 3: 4 concurrent points)
    const pointTasks = selectedPointsData.map((point, index) => () =>
      processPoint(point, index + 1)
    );

    // Process geometries in parallel
    const geometryTasks = selectedGeometriesData.map((geometry, index) => () =>
      processGeometry(geometry, index)
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
