import multer from "multer";

const MULTER_ERROR_MESSAGES: Record<string, string> = {
  LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
  LIMIT_FILE_COUNT: "Too many files. Only one file is allowed.",
  LIMIT_PART_COUNT: "Form fields exceeded limits.",
  LIMIT_FIELD_KEY: "Form fields exceeded limits.",
  LIMIT_FIELD_VALUE: "Form fields exceeded limits.",
  LIMIT_FIELD_COUNT: "Form fields exceeded limits.",
};

export function mapMulterError(err: unknown): string {
  if (err instanceof multer.MulterError) {
    return MULTER_ERROR_MESSAGES[err.code] ?? `Upload failed: ${err.code}`;
  }
  return (err as Error)?.message || "Upload failed";
}
