import { PDFDocument } from "pdf-lib";

export async function screenshotDataUrlToPdfBlob(dataUrl: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const imageBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
  const image = await pdfDoc.embedPng(imageBytes);
  page.drawImage(image, { x: 0, y: 0, width, height });
  const pdfBytes = await pdfDoc.save();
  // @ts-ignore
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export async function takeMapScreenshotBlob(
  mapView: __esri.MapView,
  value: string
): Promise<Blob> {
  const scale = value === "jpeg" ? 12 : 5;
  const format = value === "pdf" ? "png" : value;
  // @ts-ignore
  const screenshot = await mapView.takeScreenshot({
    format: format as any,
    quality: 1,
    width: mapView.width * scale,
    height: mapView.height * scale,
  });
  if (value === "PDF") {
    return screenshotDataUrlToPdfBlob(screenshot.dataUrl);
  }
  return (await fetch(screenshot.dataUrl)).blob();
}
