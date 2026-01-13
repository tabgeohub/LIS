/* eslint-disable no-useless-escape */
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { generatePdfReport } from "../helpers/generatePdfReport";
import JSZip from "jszip";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { PDFPointDataType } from "Types";
import {
  FinishedFlightPlanType,
  FinishedPointType,
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

    const tempLayer = new GraphicsLayer();
    mapView.map.add(tempLayer);

    const zip = new JSZip();
    const attachmentsFolder = zip.folder("attachments");
    const totalPoints = selectedPointsData.length;
    setZippingStatus("Waarnemingsrapporten worden gegenereerd...");

    const featureLayerUrl =
      "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer";

    const preloadTasks: (() => Promise<{
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

    const [preloaded, logoDataUrl] = await Promise.all([
      runWithConcurrency(preloadTasks, 2),
      preloadLogoDataUrl(),
    ]);

    const attachmentsByPoint = new Map<
      number,
      { name: string; blob: Blob }[]
    >();
    for (const item of preloaded as {
      pointId: number;
      attachments: { name: string; blob: Blob }[];
    }[]) {
      attachmentsByPoint.set(item.pointId, item.attachments);
    }

    for (let i = 0; i < totalPoints; i++) {
      const point = selectedPointsData[i];
      setZippingStatus(
        `Rapport ${i + 1} van ${totalPoints} wordt gegenereerd: '${
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

      const overviewImage = await getStaticMapImage(
        point.longitude,
        point.latitude,
        10,
        1600,
        900,
        MAPSERVER_URL
      );

      const detailImage = await getStaticMapImage(
        point.longitude,
        point.latitude,
        17,
        1600,
        900,
        MAPSERVER_URL
      );

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
      zip.file(`Waarnemingsrapport_Point_${safeName}.pdf`, arrayBuffer);

      // Create a folder for this point inside the attachments folder
      if (attachments.length > 0) {
        const pointFolder = attachmentsFolder?.folder(safeName);
        attachments.forEach((attr, index) => {
          const extension =
            (attr.blob.type.split("/")[1] || "").split(";")[0] || "bin";
          const filename = `attachment_${index + 1}.${extension}`;
          pointFolder?.file(filename, attr.blob);
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
