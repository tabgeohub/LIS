type AdminPageHeaderProps = {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

/** Shared header for admin utility pages (installers, device updates). */
export default function AdminPageHeader({
  title,
  description,
  backHref = "/",
  backLabel = "Back to LIS",
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <a
        href={backHref}
        className="rounded-md bg-white px-4 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-100"
      >
        {backLabel}
      </a>
    </div>
  );
}
