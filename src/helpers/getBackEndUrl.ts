export function getBackEndUrl() {
  if (import.meta.env.PROD) {
    if (window.location.href.includes("intranet")) {
      return `${import.meta.env.VITE_INTRANET_BACKEND_URL}`;
    } else {
      return `${import.meta.env.VITE_EXTERNAL_BACKEND_URL}`;
    }
  } else {
    return "http://localhost:5000";
  }
}
