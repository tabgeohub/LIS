import { useEffect } from "react";
import type { AttachmentType } from "Types/finished_plans";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";

export function useImageGalleryPreload(input: {
  isOpen: boolean;
  attachments: AttachmentType[];
  activeIndex: number;
}) {
  const { isOpen, attachments, activeIndex } = input;
  useEffect(() => {
    if (!isOpen || attachments.length <= 1) return;
    const preload = (url: string) => {
      const img = new Image();
      img.src = url;
    };
    const nextIndex = (activeIndex + 1) % attachments.length;
    const prevIndex =
      (activeIndex - 1 + attachments.length) % attachments.length;
    if (attachments[nextIndex]) {
      preload(attachmentDisplayUrl(attachments[nextIndex].url));
    }
    if (attachments[prevIndex]) {
      preload(attachmentDisplayUrl(attachments[prevIndex].url));
    }
  }, [isOpen, activeIndex, attachments]);
}
