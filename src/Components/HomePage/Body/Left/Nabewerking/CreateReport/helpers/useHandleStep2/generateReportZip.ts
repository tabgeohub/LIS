import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import JSZip from "jszip";
import { assembleReportZipContents } from "./assembleReportZipContents";
import { filterSelectedReportData } from "./filterSelectedReportData";
import type { GenerateReportZipInput } from "./generateReportZipTypes";
import {
  reportZipErrorStatus,
  writeReportZipBlob,
} from "./writeReportZipBlob";

export type { GenerateReportZipInput } from "./generateReportZipTypes";

export async function generateReportZip(
  input: GenerateReportZipInput
): Promise<void> {
  const selection = filterSelectedReportData(input);
  const tempLayer = new GraphicsLayer();
  input.map.add(tempLayer);
  const zip = new JSZip();
  input.setZippingStatus("Waarnemingsrapporten worden gegenereerd...");
  try {
    await assembleReportZipContents({ ...input, ...selection, tempLayer, zip });
    await writeReportZipBlob({
      zip,
      setZipFile: input.setZipFile,
      setZippingStatus: input.setZippingStatus,
    });
  } catch (err) {
    console.error("Report generation failed:", err);
    input.setZippingStatus(reportZipErrorStatus(err));
  } finally {
    input.map.remove(tempLayer);
  }
}
