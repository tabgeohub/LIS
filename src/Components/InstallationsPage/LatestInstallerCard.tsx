import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import { formatBytes } from "helpers/format/formatBytes";
import type { InstallerMeta } from "Types/installer";

type LatestInstallerCardProps = {
  loading: boolean;
  installer: InstallerMeta | null;
};

export default function LatestInstallerCard({
  loading,
  installer,
}: LatestInstallerCardProps) {
  return (
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
            <span className="font-medium">Version:</span>{" "}
            {installer.version || "Not set"}
          </p>
          <p>
            <span className="font-medium">Size:</span>{" "}
            {formatBytes(installer.size)}
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
  );
}
