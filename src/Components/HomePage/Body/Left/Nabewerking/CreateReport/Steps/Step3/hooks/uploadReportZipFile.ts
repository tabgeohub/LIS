import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { DownloadInfo } from "../types";

function buildSafeZipFilename(omschrijving: string): string {
  const rawName = `${omschrijving || "report"}`.trim();
  // @ts-ignore – unicode safe replace
  const safeName = rawName.replace(/[^\p{L}\p{N}\s._-]+/gu, "_");
  return `${safeName}.zip`;
}

async function readUploadErrorMessage(res: Response): Promise<string> {
  const msg = await res.text().catch(() => "");
  return msg || `Upload failed (${res.status})`;
}

function readUploadUrl(result: { url?: unknown }): string {
  if (!result?.url || typeof result.url !== "string") {
    throw new Error("Bad response from server (missing url)");
  }
  return result.url;
}

export async function uploadReportZipFile(input: {
  zipFile: Blob;
  omschrijving: string;
}): Promise<DownloadInfo> {
  const formData = new FormData();
  const filename = buildSafeZipFilename(input.omschrijving);
  formData.append("report", input.zipFile, filename);

  const res = await fetch(`${getBackEndUrl()}/api/upload-report`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await readUploadErrorMessage(res));
  }

  const result = await res.json().catch(() => ({} as any));
  return { url: readUploadUrl(result), filename };
}
