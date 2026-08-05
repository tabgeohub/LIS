export const EXPORT_IMAGE_FORMATS = [
  { value: "bmp", label: "BMP" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "tiff", label: "TIFF" },
  { value: "pdf", label: "PDF" },
] as const;

export type ExportImageFormat = (typeof EXPORT_IMAGE_FORMATS)[number]["value"];
