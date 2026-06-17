import { useEffect, useMemo, useState } from "react";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import type { InstallerMeta } from "Types/installer";

function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, exp);
  return `${size.toFixed(size >= 10 || exp === 0 ? 0 : 1)} ${units[exp]}`;
}

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

  async function fetchLatestInstaller() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getBackEndUrl()}/api/installers`, {
        credentials: "include",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to fetch installer data");
      }
      const body = (await response.json()) as { installer: InstallerMeta | null };
      setInstaller(body.installer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLatestInstaller();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const formData = new FormData();
      formData.append("installer", file);
      if (version.trim()) formData.append("version", version.trim());

      const response = await fetch(`${getBackEndUrl()}/api/installers/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Upload failed");
      }

      setFile(null);
      setVersion("");
      await fetchLatestInstaller();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteLatest() {
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`${getBackEndUrl()}/api/installers/latest`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to delete installer");
      }
      setInstaller(null);
      setFile(null);
      setVersion("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Installations</h1>
          <a
            href="/"
            className="rounded-md bg-white px-4 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-100"
          >
            Back to LIS
          </a>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Latest installer</h2>

          {loading ? (
            <p className="mt-3 text-sm text-gray-600">Loading installer info...</p>
          ) : !installer ? (
            <p className="mt-3 text-sm text-gray-600">No installer uploaded yet.</p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">File:</span> {installer.originalName}
              </p>
              <p>
                <span className="font-medium">Version:</span> {installer.version || "Not set"}
              </p>
              <p>
                <span className="font-medium">Size:</span> {formatSize(installer.size)}
              </p>
              <p>
                <span className="font-medium">Uploaded:</span>{" "}
                {new Date(installer.uploadedAt).toLocaleString()}
              </p>

              <a
                href={`${getBackEndUrl()}/api/installers/download`}
                className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Download installer
              </a>
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Admin upload</h2>
            <p className="mt-1 text-sm text-gray-600">
              Allowed files: .exe, .msi, .zip (max 1 GB). Upload replaces the existing installer.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleUpload}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Version (optional)
                </label>
                <input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. 1.0.2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Installer file</label>
                <input
                  type="file"
                  accept=".exe,.msi,.zip"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload new installer"}
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteLatest}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete current installer"}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
