import type { AttachmentType } from "Types/finished_plans";
import {
  GalleryCloseButton,
  GalleryDeleteButton,
  GalleryLocationButton,
} from "./ImageGalleryToolbarButtons";

export function ImageGalleryToolbar(props: {
  attachments: AttachmentType[];
  activeIndex: number;
  onClose: () => void;
  onDelete?: () => void;
  onShowLocation?: (location: string) => void;
}) {
  const location = props.attachments[props.activeIndex]?.location;
  const showLocation = Boolean(props.onShowLocation && location);

  return (
    <>
      <GalleryCloseButton onClose={props.onClose} />
      {showLocation && location && props.onShowLocation && (
        <GalleryLocationButton
          location={location}
          onShowLocation={props.onShowLocation}
        />
      )}
      {props.onDelete && (
        <GalleryDeleteButton
          onDelete={props.onDelete}
          showLocation={showLocation}
        />
      )}
    </>
  );
}
