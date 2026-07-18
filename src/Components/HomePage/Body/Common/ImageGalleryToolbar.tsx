import type { AttachmentType } from "Types/finished_plans";

export function ImageGalleryToolbar(props: {
  attachments: AttachmentType[];
  activeIndex: number;
  onClose: () => void;
  onDelete?: () => void;
  onShowLocation?: (location: string) => void;
}) {
  const location = props.attachments[props.activeIndex]?.location;
  const showLocation = Boolean(props.onShowLocation && location);
  const btn =
    "absolute top-4 z-50 border-2 border-white text-white p-2 rounded-full transition-all";

  return (
    <>
      <button
        onClick={props.onClose}
        className={`${btn} right-4 bg-red-500 hover:bg-red-600`}
        aria-label="Close gallery"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {showLocation && (
        <button
          onClick={() => location && props.onShowLocation?.(location)}
          className={`${btn} right-20 bg-blue-500 hover:bg-blue-600`}
          title="Show location on map"
          aria-label="Show location on map"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {props.onDelete && (
        <button
          onClick={props.onDelete}
          className={`${btn} bg-red-500 hover:bg-red-600 ${
            showLocation ? "right-32" : "right-20"
          }`}
          title="Delete image"
          aria-label="Delete image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </>
  );
}
