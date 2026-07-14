import localforage from "localforage";
import { LogEntry } from "./logEntry";

const queue: LogEntry[] = [];
let intervalStarted = false;

type SendLogs = (input: {
  data: { logs: LogEntry[] };
  onSuccess: () => void;
  disableErrorMessage: boolean;
  disableSuccessMessage: boolean;
}) => Promise<unknown>;

export function initializeLogQueue(sendLogs: SendLogs) {
  if (intervalStarted) return;
  intervalStarted = true;
  setInterval(async () => {
    if (queue.length === 0) return;
    const batch = queue.splice(0, queue.length);
    try {
      await sendLogs({
        data: { logs: batch },
        onSuccess: () => {},
        disableErrorMessage: true,
        disableSuccessMessage: true,
      });
    } catch (error) {
      queue.unshift(...batch);
      console.error("Error sending logs to server:", error);
    }
  }, 60_000);

  window.addEventListener("beforeunload", () => {
    if (queue.length === 0) return;
    navigator.sendBeacon?.(
      "/api/logs/podLogs",
      JSON.stringify({ logs: queue })
    );
  });
}

export async function enqueueLogEntry(logEntry: LogEntry) {
  queue.push(logEntry);
  try {
    const key = "logging";
    const existing = (await localforage.getItem<LogEntry[]>(key)) || [];
    existing.push(logEntry);
    await localforage.setItem(key, existing);
  } catch (error) {
    console.error("Error saving log locally:", error);
  }
}
