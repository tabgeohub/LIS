import { useBottomCompactListCallback } from "./useBottomCompactListCallback";

export function useBottomCompactListView(input?: { logMessage?: string }) {
  return useBottomCompactListCallback(input?.logMessage);
}
