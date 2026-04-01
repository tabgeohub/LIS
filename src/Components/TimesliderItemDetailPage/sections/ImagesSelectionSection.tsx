import type { AttachmentType } from "Types/finished_plans";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";

type Props = {
  images: AttachmentType[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  loading: boolean;
};

export default function ImagesSelectionSection({
  images,
  selectedIndex,
  onSelect,
  loading,
}: Props) {
  return (
    <section
      className="flex h-36 shrink-0 flex-col border-t border-gray-200 bg-white px-2 py-2"
      aria-label="Afbeeldingen selectie"
    >
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        Galerij
      </div>
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
        {loading && images.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-gray-500">Laden…</span>
          </div>
        ) : images.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-400">Geen miniaturen</span>
          </div>
        ) : (
          <ul className="flex h-full gap-2 pb-1">
            {images.map((img, index) => {
              const thumbUrl = attachmentDisplayUrl(img.url);
              const selected = index === selectedIndex;
              return (
                <li key={img.id} className="h-full shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`h-full w-24 overflow-hidden rounded border-2 bg-gray-100 transition-colors ${
                      selected
                        ? "border-primary ring-1 ring-primary/30"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    aria-label={`Afbeelding ${index + 1}`}
                    aria-current={selected ? "true" : undefined}
                  >
                    <img
                      src={thumbUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
