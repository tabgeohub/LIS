export function buildReportDownloadUrl(filename: string): string {
  const baseUrl =
    process.env.PUBLIC_APP_BASE_URL ||
    process.env.REACT_APP_EXTERNAL_BACKEND_URL ||
    "http://localhost:5000";

  return `${baseUrl.replace(/\/+$/, "")}/api/file-download/${encodeURIComponent(filename)}`;
}

export function buildReportUploadResponse(file: Express.Multer.File) {
  return {
    url: buildReportDownloadUrl(file.filename),
    file: {
      name: file.originalname,
      savedAs: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    },
  };
}
