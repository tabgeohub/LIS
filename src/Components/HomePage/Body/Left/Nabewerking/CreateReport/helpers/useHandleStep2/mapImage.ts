import { fetchWithRetry } from "./utils";

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

export async function getStaticMapImage(
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

