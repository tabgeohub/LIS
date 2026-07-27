import multer from "multer";

const MULTER_ERROR_MESSAGES: Record<string, string> = {
  LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
  LIMIT_FILE_COUNT: "Too many files. Only one file is allowed.",
  LIMIT_PART_COUNT: "Form fields exceeded limits.",
  LIMIT_FIELD_KEY: "Form fields exceeded limits.",
  LIMIT_FIELD_VALUE: "Form fields exceeded limits.",
  LIMIT_FIELD_COUNT: "Form fields exceeded limits.",
  LIMIT_FIELD_NESTING: "Form fields exceeded limits.",
};

function mapKnownMulterError(err: multer.MulterError): string {
  return MULTER_ERROR_MESSAGES[err.code] ?? `Upload failed: ${err.code}`;
}

function mapGenericUploadError(err: unknown): string {
  return (err as Error)?.message || "Upload failed";
}

export function mapMulterError(err: unknown): string {
  if (err instanceof multer.MulterError) {
    return mapKnownMulterError(err);
  }
  return mapGenericUploadError(err);
}
