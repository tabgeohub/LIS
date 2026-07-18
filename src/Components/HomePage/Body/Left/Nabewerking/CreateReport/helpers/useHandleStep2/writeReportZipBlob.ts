import JSZip from "jszip";

export function reportZipErrorStatus(err: unknown): string {
  const message =
    err instanceof Error ? err.message : "Rapport genereren mislukt";
  return `error:${message}`;
}

export async function writeReportZipBlob(input: {
  zip: InstanceType<typeof JSZip>;
  setZipFile: (zipFile: Blob) => void;
  setZippingStatus: (status: string) => void;
}): Promise<void> {
  input.setZippingStatus("Bestanden worden ingepakt...");
  const zipBlob = await input.zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 1 },
  });
  input.setZipFile(zipBlob);
  input.setZippingStatus("finish.");
}
