import type { AttachmentType } from "Types/finished_plans";
import {
  GalleryCloseButton,
  GalleryDeleteButton,
  GalleryLocationButton,
} from "./ImageGalleryToolbarButtons";

function resolveActiveLocation(
  attachments: AttachmentType[],
  activeIndex: number
): string | undefined {
  return attachments[activeIndex]?.location;
}

export function ImageGalleryToolbar(props: {
  attachments: AttachmentType[];
  activeIndex: number;
  onClose: () => void;
  onDelete?: () => void;
  onShowLocation?: (location: string) => void;
}) {
  const location = resolveActiveLocation(props.attachments, props.activeIndex);
  const canShowLocation = Boolean(props.onShowLocation && location);

  return (
    <>
      <GalleryCloseButton onClose={props.onClose} />
      {canShowLocation && location && props.onShowLocation && (
        <GalleryLocationButton
          location={location}
          onShowLocation={props.onShowLocation}
        />
      )}
      {props.onDelete && (
        <GalleryDeleteButton
          onDelete={props.onDelete}
          showLocation={canShowLocation}
        />
      )}
    </>
  );
}
