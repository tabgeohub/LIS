import dayjs from "dayjs";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { AttachmentType } from "Types/finished_plans";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";

type Props = {
  attachment: AttachmentType | null;
  plansLoading: boolean;
  loading: boolean;
  error: string | null;
  emptyMessage: string | null;
  /** When set with more than one image, chevrons are shown on the sides of the viewer. */
  imageNav?: {
    canGoPrevious: boolean;
    canGoNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
  };
  /** 1-based current index and total count, shown under the image. */
  imageIndex?: { current: number; total: number };
};

export default function MainImageSection({
  attachment,
  plansLoading,
  loading,
  error,
  emptyMessage,
  imageNav,
  imageIndex,
}: Props) {
  const url = attachment ? attachmentDisplayUrl(attachment.url) : "";
  const takenLabel =
    attachment?.taken_at && attachment.taken_at > 0
      ? dayjs(attachment.taken_at).format("DD-MM-YYYY HH:mm")
      : null;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col bg-gray-900/5"
      aria-label="Hoofdafbeelding"
    >
      <div className="m-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
        {plansLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-sm text-gray-500">Plannen laden…</span>
          </div>
        ) : loading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-sm text-gray-500">Afbeeldingen laden…</span>
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center px-4 text-center">
            <span className="text-sm text-red-600">{error}</span>
          </div>
        ) : emptyMessage ? (
          <div className="flex flex-1 items-center justify-center px-4 text-center">
            <span className="text-sm text-gray-500">{emptyMessage}</span>
          </div>
        ) : url ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-gray-950/5 p-2">
              {imageNav ? (
                <>
                  <button
                    type="button"
                    onClick={imageNav.onPrevious}
                    disabled={!imageNav.canGoPrevious}
                    className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-35"
                    aria-label="Vorige afbeelding"
                  >
                    <LuChevronLeft className="h-6 w-6" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={imageNav.onNext}
                    disabled={!imageNav.canGoNext}
                    className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-35"
                    aria-label="Volgende afbeelding"
                  >
                    <LuChevronRight className="h-6 w-6" strokeWidth={2.25} />
                  </button>
                </>
              ) : null}
              <img
                src={url}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {imageIndex || takenLabel ? (
              <div className="shrink-0 space-y-0.5 border-t border-gray-100 px-3 py-1.5 text-center">
                {imageIndex ? (
                  <div
                    className="text-xs font-medium tabular-nums text-gray-600"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {imageIndex.current} / {imageIndex.total}
                  </div>
                ) : null}
                {takenLabel ? (
                  <div className="text-[11px] text-gray-500">{takenLabel}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-sm text-gray-400">Geen voorbeeld</span>
          </div>
        )}
      </div>
    </section>
  );
}
