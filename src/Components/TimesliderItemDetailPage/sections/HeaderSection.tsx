import { Link } from "react-router-dom";

/** Top bar: title, navigation — content TBD. */
export default function HeaderSection() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          ← Kaart
        </Link>
        <span className="truncate text-sm font-semibold text-gray-800">
          Afbeeldingen
        </span>
      </div>
      <div className="text-[10px] uppercase tracking-wide text-gray-400">
        Header
      </div>
    </header>
  );
}
