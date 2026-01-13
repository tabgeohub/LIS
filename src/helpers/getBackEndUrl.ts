export function getBackEndUrl() {
  if (process.env.NODE_ENV === "production") {
    if (window.location.href.includes("intranet")) {
      return `${process.env.REACT_APP_INTRANET_BACKEND_URL}`;
    } else {
      return `${process.env.REACT_APP_EXTERNAL_BACKEND_URL}`;
    }
  } else {
    return "http://localhost:5000";
  }
}
