import { useTabState } from "@helpers/ZustandStates/tabState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import localforage from "localforage";
import { useCreateData } from "utils/useCreateData";

const queue: any[] = [];
let intervalStarted = false;

export default function useLogAction() {
  const { user } = useAuth();
  const { selectedPage, selectedTab } = useTabState();
  const { create } = useCreateData("/logs/podLogs");

  if (!intervalStarted) {
    intervalStarted = true;

    setInterval(async () => {
      if (queue.length === 0) return;
      const batch = queue.splice(0, queue.length);
      try {
        await create({ logs: batch }, () => {}, false, true);
      } catch (e) {
        queue.unshift(...batch);
        console.error("Error sending logs to server:", e);
      }
    }, 60_000);

    window.addEventListener("beforeunload", () => {
      if (queue.length === 0) return;
      const payload = JSON.stringify({ logs: queue });
      navigator.sendBeacon?.("/api/logs/podLogs", payload);
    });
  }

  return async function logAction({
    message,
    step,
    oldData,
    newData,
  }: {
    message: string;
    step?: string;
    oldData?: any;
    newData?: any;
  }) {
    const logEntry = {
      message: message || "",
      userId: user?.user_id ?? null,
      userName: user?.user_name ?? null,
      userRole: user?.role ?? null,
      date: new Date().toISOString(),
      oldData: oldData ?? null,
      newData: newData ?? null,
      step: step ?? null,
      tab: selectedTab,
      page: selectedPage,
    };

    queue.push(logEntry);

    try {
      const key = "logging";
      const existing = ((await localforage.getItem<(typeof logEntry)[]>(key)) ||
        []) as (typeof logEntry)[];
      existing.push(logEntry);
      await localforage.setItem(key, existing);
    } catch (err) {
      console.error("Error saving log locally:", err);
    }
  };
}
