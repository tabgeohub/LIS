import { useEffect, useMemo, useState } from "react";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { attachmentDisplayUrl } from "../Common/attachmentDisplayUrl";
import { pointPlanImagesToAttachments } from "../Common/pointPlanImagesToAttachments";
import { usePointPlanImages } from "../Common/usePointPlanImages";

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
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { images, loading, error } = usePointPlanImages({
    pointId,
    planIds,
    regioId,
    enabled: isOpen,
  });

  const { plans } = useTimesliderState();
  const vluchtnummerByPlanId = useMemo(() => {
    const m = new Map<number, string>();
    for (const p of plans) {
      if (p.vluchtnummer) m.set(p.id, p.vluchtnummer);
    }
    return m;
  }, [plans]);

  const attachments = useMemo(
    () => pointPlanImagesToAttachments(images),
    [images]
  );

  useEffect(() => {
    if (attachments.length === 0) setGalleryOpen(false);
  }, [attachments.length]);

  useEffect(() => {
    if (activeIndex >= attachments.length && attachments.length > 0) {
      setActiveIndex(attachments.length - 1);
    }
  }, [attachments.length, activeIndex]);

  const openGalleryAt = (imageId: number) => {
    const idx = attachments.findIndex((a) => a.id === imageId);
    setActiveIndex(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
  };

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
              onClick={() => openGalleryAt(img.id)}
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
                {vluchtnummerByPlanId.get(img.plan_id) ?? ""}
              </span>
            </button>
          ))}
        </div>
      )}

      {attachments.length > 0 && (
        <ImageGallery
          isOpen={galleryOpen}
          setIsOpen={setGalleryOpen}
          attachments={attachments}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}
    </div>
  );
}
