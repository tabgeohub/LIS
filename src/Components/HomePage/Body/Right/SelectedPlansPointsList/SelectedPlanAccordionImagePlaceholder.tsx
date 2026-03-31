import { HiOutlinePhotograph } from "react-icons/hi";

/** Placeholder grid until attachments API is wired. */
export default function SelectedPlanAccordionImagePlaceholder({
  title = "Afbeeldingen",
}: {
  title?: string;
}) {
  const placeholders = [1, 2, 3, 4];

  return (
    <div className="space-y-2">
      <div>
        <p className="text-[11px] font-semibold text-gray-700">{title}</p>
        <p className="text-[10px] text-gray-400">
          Voorbeeldweergave — API-koppeling volgt.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {placeholders.map((i) => (
          <div
            key={i}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 bg-white/80 text-gray-400"
          >
            <HiOutlinePhotograph className="size-8 opacity-50" />
            <span className="px-1 text-center text-[9px] text-gray-400">
              Voorbeeld {i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
