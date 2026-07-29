import { useEffect, useMemo, useState } from "react";
import ImageGallery from "Components/HomePage/Body/Common/ImageGallery";
import { useTimesliderState } from "hooks/zustand/ui";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import {
  pointPlanImagesToAttachments,
  type PointPlanImageRow,
} from "api-hooks/planImages";

function buildVluchtnummerByPlanId(
  plans: Array<{ id: number; vluchtnummer?: string | null }>
) {
  const m = new Map<number, string>();
  for (const p of plans) {
    if (p.vluchtnummer) m.set(p.id, p.vluchtnummer);
  }
  return m;
}

function PanelStatusMessage(props: {
  loading: boolean;
  error: string | null;
  imagesLength: number;
  emptyMessage: string;
}) {
  if (props.loading) {
    return <p className="text-[11px] text-gray-500">Laden...</p>;
  }
  if (props.error) {
    return <p className="text-[11px] text-red-600">{props.error}</p>;
  }
  if (props.imagesLength === 0) {
    return <p className="text-[11px] text-gray-500">{props.emptyMessage}</p>;
  }
  return null;
}

function clampActiveIndex(activeIndex: number, length: number): number {
  if (length === 0) return 0;
  if (activeIndex >= length) return length - 1;
  return activeIndex;
}

export default function SelectedPlanImagesPanel({
  images,
  loading,
  error,
  emptyMessage,
}: {
  images: PointPlanImageRow[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { plans } = useTimesliderState();
  const vluchtnummerByPlanId = useMemo(
    () => buildVluchtnummerByPlanId(plans),
    [plans]
  );

  const attachments = useMemo(
    () => pointPlanImagesToAttachments(images),
    [images]
  );

  useEffect(() => {
    if (attachments.length === 0) setGalleryOpen(false);
  }, [attachments.length]);

  useEffect(() => {
    setActiveIndex((prev) => clampActiveIndex(prev, attachments.length));
  }, [attachments.length]);

  const openGalleryAt = (imageId: number) => {
    const idx = attachments.findIndex((a) => a.id === imageId);
    setActiveIndex(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
  };

  const showGrid = !loading && images.length > 0;

  return (
    <div className="space-y-2">
      <div>
        <p className="text-[11px] font-semibold text-gray-700">Afbeeldingen</p>
      </div>

      <PanelStatusMessage
        loading={loading}
        error={error}
        imagesLength={images.length}
        emptyMessage={emptyMessage}
      />

      {showGrid && (
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
