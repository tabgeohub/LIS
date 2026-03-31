import dayjs from "dayjs";
import type { AttachmentType } from "Types/finished_plans";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";

type Props = {
  attachment: AttachmentType | null;
  plansLoading: boolean;
  loading: boolean;
  error: string | null;
  emptyMessage: string | null;
};

export default function MainImageSection({
  attachment,
  plansLoading,
  loading,
  error,
  emptyMessage,
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
            <div className="flex min-h-0 flex-1 items-center justify-center bg-gray-950/5 p-2">
              <img
                src={url}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {takenLabel ? (
              <div className="shrink-0 border-t border-gray-100 px-3 py-1.5 text-center text-[11px] text-gray-500">
                {takenLabel}
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
