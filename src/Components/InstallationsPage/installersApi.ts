import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import type { InstallerMeta } from "Types/installer";

export async function fetchLatestInstaller(): Promise<InstallerMeta | null> {
  const response = await fetch(`${getBackEndUrl()}/api/installers`, {
    credentials: "include",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Failed to fetch installer data");
  }
  const body = (await response.json()) as { installer: InstallerMeta | null };
  return body.installer;
}

export async function uploadInstaller(input: {
  file: File;
  version?: string;
}): Promise<void> {
  const formData = new FormData();
  formData.append("installer", input.file);
  if (input.version?.trim()) formData.append("version", input.version.trim());

  const response = await fetch(`${getBackEndUrl()}/api/installers/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Upload failed");
  }
}

export async function deleteLatestInstaller(): Promise<void> {
  const response = await fetch(`${getBackEndUrl()}/api/installers/latest`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Failed to delete installer");
  }
}
