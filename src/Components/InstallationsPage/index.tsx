import { useEffect, useMemo, useState } from "react";
import { useAuth } from "hooks/zustand/ui";
import type { InstallerMeta } from "Types/installer";
import AdminPageHeader from "Components/Common/AdminPageHeader";
import AdminUploadForm from "./AdminUploadForm";
import LatestInstallerCard from "./LatestInstallerCard";
import {
  deleteLatestInstaller,
  fetchLatestInstaller,
  uploadInstaller,
} from "./installersApi";

export default function InstallationsPage() {
  const { user } = useAuth();
  const [installer, setInstaller] = useState<InstallerMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [version, setVersion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = useMemo(() => user.role === "admin", [user.role]);

  async function loadLatestInstaller() {
    setLoading(true);
    setError(null);
    try {
      setInstaller(await fetchLatestInstaller());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLatestInstaller();
  }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError("Select an installer file first.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await uploadInstaller({ file, version });
      setFile(null);
      setVersion("");
      await loadLatestInstaller();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteLatest() {
    setDeleting(true);
    setError(null);
    try {
      await deleteLatestInstaller();
      setInstaller(null);
      setFile(null);
      setVersion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <AdminPageHeader
          title="Installations"
          description="Download or replace the desktop installer package."
        />

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <LatestInstallerCard loading={loading} installer={installer} />

        {isAdmin && (
          <AdminUploadForm
            version={version}
            setVersion={setVersion}
            setFile={setFile}
            uploading={uploading}
            deleting={deleting}
            onUpload={handleUpload}
            onDeleteLatest={handleDeleteLatest}
          />
        )}
      </div>
    </div>
  );
}
