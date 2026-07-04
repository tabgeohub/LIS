import jsPDF from "jspdf";

export function fitImageToBox(input: {
  imgW: number;
  imgH: number;
  maxW: number;
  maxH: number;
}): { w: number; h: number } {
  const ratio = Math.min(input.maxW / input.imgW, input.maxH / input.imgH);
  return { w: input.imgW * ratio, h: input.imgH * ratio };
}

export async function imageDataToJpegDataUrl(input: {
  img: ImageData;
  targetW: number;
  targetH: number;
  quality: number;
}): Promise<string> {
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = input.img.width;
  srcCanvas.height = input.img.height;
  srcCanvas.getContext("2d")?.putImageData(input.img, 0, 0);

  const dstCanvas = document.createElement("canvas");
  dstCanvas.width = input.targetW;
  dstCanvas.height = input.targetH;
  const dstCtx = dstCanvas.getContext("2d");
  if (dstCtx) {
    dstCtx.drawImage(
      srcCanvas,
      0,
      0,
      input.img.width,
      input.img.height,
      0,
      0,
      input.targetW,
      input.targetH
    );
  }
  return dstCanvas.toDataURL("image/jpeg", input.quality);
}

export async function addMapPages(input: {
  doc: jsPDF;
  overviewImage: ImageData;
  detailImage: ImageData;
}) {
  const y1 = input.doc.lastAutoTable.finalY + 10;
  input.doc.text("Overzichtkaart", 25, y1);
  const overviewUrl = await imageDataToJpegDataUrl({
    img: input.overviewImage,
    targetW: 1200,
    targetH: 675,
    quality: 0.85,
  });
  input.doc.addImage(overviewUrl, "JPEG", 25, y1 + 2, 160, 90);

  input.doc.addPage();
  input.doc.text("Detailkaart", 25, 20);
  const detailUrl = await imageDataToJpegDataUrl({
    img: input.detailImage,
    targetW: 1200,
    targetH: 675,
    quality: 0.9,
  });
  input.doc.addImage(detailUrl, "JPEG", 25, 22, 160, 90);
}
