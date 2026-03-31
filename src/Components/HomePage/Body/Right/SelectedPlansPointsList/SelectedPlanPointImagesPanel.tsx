import { useState } from "react";
import Modal from "Components/HomePage/Body/Common/Modal";
import { attachmentDisplayUrl } from "./attachmentDisplayUrl";
import { usePointPlanImages, type PointPlanImageRow } from "./usePointPlanImages";

export default function SelectedPlanPointImagesPanel({
  pointId,
  planIds,
  regioId,
  isOpen,
}: {
  pointId: number;
  planIds: number[];
  regioId: string | undefined;
  isOpen: boolean;
}) {
  const [preview, setPreview] = useState<PointPlanImageRow | null>(null);
  const { images, loading, error } = usePointPlanImages({
    pointId,
    planIds,
    regioId,
    enabled: isOpen,
  });

  return (
    <div className="space-y-2">
      <div>
        <p className="text-[11px] font-semibold text-gray-700">Afbeeldingen</p>
      </div>

      {loading && (
        <p className="text-[11px] text-gray-500">Laden...</p>
      )}

      {error && !loading && (
        <p className="text-[11px] text-red-600">{error}</p>
      )}

      {!loading && !error && images.length === 0 && (
        <p className="text-[11px] text-gray-500">
          Geen afbeeldingen voor dit punt in de geselecteerde plannen.
        </p>
      )}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setPreview(img)}
              className="group block min-w-0 overflow-hidden rounded border border-gray-200 bg-gray-50 text-left outline-none ring-primary transition-shadow hover:ring-1 focus-visible:ring-2"
            >
              <div className="h-20 w-full bg-gray-100 sm:h-24">
                <img
                  src={attachmentDisplayUrl(img.url)}
                  alt=""
                  width={120}
                  height={96}
                  className="size-full object-cover transition-opacity group-hover:opacity-90"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="33vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="block truncate px-0.5 py-px text-center text-[8px] leading-tight text-gray-500">
                #{img.plan_id}
              </span>
            </button>
          ))}
        </div>
      )}

      <Modal
        isOpen={preview != null}
        setIsOpen={(open) => {
          if (!open) setPreview(null);
        }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-lg bg-white p-3 shadow-xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {preview ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-end gap-2">
              <a
                href={attachmentDisplayUrl(preview.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-primary hover:underline"
              >
                Open in nieuw tabblad
              </a>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Sluiten
              </button>
            </div>
            <div className="flex max-h-[min(80vh,720px)] min-h-0 items-center justify-center overflow-auto rounded-md bg-gray-100">
              <img
                src={attachmentDisplayUrl(preview.url)}
                alt=""
                className="max-h-[min(80vh,720px)] w-full object-contain"
                decoding="async"
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
