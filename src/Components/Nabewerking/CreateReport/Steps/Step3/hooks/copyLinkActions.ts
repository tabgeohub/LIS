import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import type { DownloadInfo } from "../types";

export function filenameFromDownloadUrl(downloadUrl: string): string {
  const url = new URL(downloadUrl, getBackEndUrl());
  const parts = url.pathname.split("/");
  return parts[parts.length - 1];
}

export async function setDownloadPassword(input: {
  downloadInfo: DownloadInfo;
  password: string;
}): Promise<void> {
  const filename = filenameFromDownloadUrl(input.downloadInfo.url);
  const res = await fetch(
    `${getBackEndUrl()}/api/file-download/${encodeURIComponent(
      filename
    )}/password`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input.password }),
    }
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Failed to set password (${res.status})`);
  }
}

export async function copyDownloadLinkAfterPassword(input: {
  downloadInfo: DownloadInfo;
  password: string;
}): Promise<void> {
  await setDownloadPassword(input);
  await navigator.clipboard.writeText(input.downloadInfo.url);
}
