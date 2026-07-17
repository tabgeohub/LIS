import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { DownloadInfo } from "../types";

export async function uploadReportZipFile(input: {
  zipFile: Blob;
  omschrijving: string;
}): Promise<DownloadInfo> {
  const formData = new FormData();
  const rawName = `${input.omschrijving || "report"}`.trim();
  // @ts-ignore – unicode safe replace
  const safeName = rawName.replace(/[^\p{L}\p{N}\s._-]+/gu, "_");
  const filename = `${safeName}.zip`;
  formData.append("report", input.zipFile, filename);

  const res = await fetch(`${getBackEndUrl()}/api/upload-report`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Upload failed (${res.status})`);
  }

  const result = await res.json().catch(() => ({} as any));
  if (!result?.url || typeof result.url !== "string") {
    throw new Error("Bad response from server (missing url)");
  }

  return { url: result.url, filename };
}
