type AdminUploadFormProps = {
  version: string;
  setVersion: (value: string) => void;
  setFile: (file: File | null) => void;
  uploading: boolean;
  deleting: boolean;
  onUpload: (e: React.FormEvent<HTMLFormElement>) => void;
  onDeleteLatest: () => void;
};

export default function AdminUploadForm({
  version,
  setVersion,
  setFile,
  uploading,
  deleting,
  onUpload,
  onDeleteLatest,
}: AdminUploadFormProps) {
  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900">Admin upload</h2>
      <p className="mt-1 text-sm text-gray-600">
        Allowed files: .exe, .msi, .zip (max 1 GB). Upload replaces the existing
        installer.
      </p>

      <form className="mt-4 space-y-4" onSubmit={onUpload}>
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Installer file
          </label>
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
            onClick={onDeleteLatest}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete current installer"}
          </button>
        </div>
      </form>
    </section>
  );
}
