import jsPDF from "jspdf";

export function fitImageToBox(
  imgW: number,
  imgH: number,
  maxW: number,
  maxH: number
): { w: number; h: number } {
  const ratio = Math.min(maxW / imgW, maxH / imgH);
  return { w: imgW * ratio, h: imgH * ratio };
}

export async function imageDataToJpegDataUrl(
  img: ImageData,
  targetW: number,
  targetH: number,
  quality: number
): Promise<string> {
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = img.width;
  srcCanvas.height = img.height;
  srcCanvas.getContext("2d")?.putImageData(img, 0, 0);

  const dstCanvas = document.createElement("canvas");
  dstCanvas.width = targetW;
  dstCanvas.height = targetH;
  const dstCtx = dstCanvas.getContext("2d");
  if (dstCtx) {
    dstCtx.drawImage(srcCanvas, 0, 0, img.width, img.height, 0, 0, targetW, targetH);
  }
  return dstCanvas.toDataURL("image/jpeg", quality);
}

export async function addMapPages(
  doc: jsPDF,
  overviewImage: ImageData,
  detailImage: ImageData
) {
  const y1 = doc.lastAutoTable.finalY + 10;
  doc.text("Overzichtkaart", 25, y1);
  const overviewUrl = await imageDataToJpegDataUrl(overviewImage, 1200, 675, 0.85);
  doc.addImage(overviewUrl, "JPEG", 25, y1 + 2, 160, 90);

  doc.addPage();
  doc.text("Detailkaart", 25, 20);
  const detailUrl = await imageDataToJpegDataUrl(detailImage, 1200, 675, 0.9);
  doc.addImage(detailUrl, "JPEG", 25, 22, 160, 90);
}
