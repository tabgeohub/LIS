import type { AttachmentType } from "Types/finished_plans";
import {
  GalleryCloseButton,
  GalleryDeleteButton,
  GalleryLocationButton,
} from "Components/HomePage/Body/Common/ImageGalleryToolbarButtons";

function resolveActiveLocation(
  attachments: AttachmentType[],
  activeIndex: number
): string | undefined {
  return attachments[activeIndex]?.location;
}

function LocationToolbarButton(props: {
  location: string | undefined;
  onShowLocation?: (location: string) => void;
}) {
  if (!props.onShowLocation || !props.location) return null;
  return (
    <GalleryLocationButton
      location={props.location}
      onShowLocation={props.onShowLocation}
    />
  );
}

function DeleteToolbarButton(props: {
  onDelete?: () => void;
  showLocation: boolean;
}) {
  if (!props.onDelete) return null;
  return (
    <GalleryDeleteButton
      onDelete={props.onDelete}
      showLocation={props.showLocation}
    />
  );
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
      <LocationToolbarButton
        location={location}
        onShowLocation={props.onShowLocation}
      />
      <DeleteToolbarButton
        onDelete={props.onDelete}
        showLocation={canShowLocation}
      />
    </>
  );
}
