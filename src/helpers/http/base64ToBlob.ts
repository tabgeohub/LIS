/** Convert a data-URL (or raw base64 payload) into a Blob for download/upload. */
export function base64ToBlob(base64: string, fallbackMime = "image/png"): Blob {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || fallbackMime;
  const payload = arr.length > 1 ? arr[1] : arr[0];
  const bstr = atob(payload);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i += 1) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}
