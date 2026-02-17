/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INTRANET_BACKEND_URL?: string;
  readonly VITE_EXTERNAL_BACKEND_URL?: string;
  readonly VITE_ARCGIS_TOKEN_ENDPOINT?: string;
  readonly VITE_ARCGIS_CLIENT_ID?: string;
  readonly VITE_ARCGIS_CLIENT_SECRET?: string;
  readonly VITE_ARCGIS_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

