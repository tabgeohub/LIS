export type EnsureFreshSessionResult = {
  ok: boolean;
  refreshed?: boolean;
  reason?: "no_session" | "no_refresh_token" | "refresh_failed";
};
