import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "hooks/zustand/ui";
import type { GetacDevice } from "Types/devices";
import {
  fetchDevicesUpdates,
  isWaitingForDeviceCommand,
  queueDeviceAction,
  resetDeviceUpdate,
} from "./devicesUpdatesApi";
import {
  deviceStatusLabel,
  formatDeviceDate,
} from "./deviceStatusLabels";
import AdminPageHeader from "Components/Common/AdminPageHeader";
import { useDeviceActionPolling } from "./useDeviceActionPolling";

export default function DevicesUpdatesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<GetacDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionDeviceId, setActionDeviceId] = useState<string | null>(null);
  const isAdmin = useMemo(() => user.role === "admin", [user.role]);

  const { stopPolling, startPolling } = useDeviceActionPolling({
    setError,
    setActionDeviceId,
    onDevicesLoaded: setDevices,
  });

  const fetchDevices = useCallback(async () => {
    setError(null);
    try {
      const next = await fetchDevicesUpdates();
      setDevices(next);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    fetchDevices();
  }, [fetchDevices, isAdmin]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  async function resetDevice(deviceId: string) {
    setError(null);
    stopPolling();
    setActionDeviceId(null);

    try {
      await resetDeviceUpdate(deviceId);
      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function queueAction(deviceId: string, action: "check-status" | "update") {
    setActionDeviceId(deviceId);
    setError(null);

    try {
      await queueDeviceAction(deviceId, action);
      await fetchDevices();
      startPolling(deviceId, action);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setActionDeviceId(null);
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <p className="text-gray-700">U bent niet geautoriseerd om deze pagina te bekijken.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <AdminPageHeader
          title="Device Updates"
          description="Manage Windows updates on Getac devices. Actions run only when you click a button."
        />

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-sm text-gray-600">Loading devices...</p>
          ) : devices.length === 0 ? (
            <p className="p-6 text-sm text-gray-600">
              No Getac devices registered yet. Install and start the Python agent on a device.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Device</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Windows</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Pending</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Last checked</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Last seen</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {devices.map((device) => {
                    const busy =
                      actionDeviceId === device.id ||
                      isWaitingForDeviceCommand(device);

                    return (
                      <tr key={device.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{device.hostname}</div>
                          <div className="text-xs text-gray-500">{device.machine_id}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <div>{device.windows_version || "Unknown"}</div>
                          <div className="text-xs text-gray-500">
                            Build {device.os_build || "Unknown"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">
                            {deviceStatusLabel(device.status)}
                          </span>
                          {device.last_error && (
                            <div className="mt-1 text-xs text-red-600">{device.last_error}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {device.pending_update_count}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDeviceDate(device.last_checked_at)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDeviceDate(device.last_seen_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={busy && actionDeviceId !== device.id}
                              onClick={() => resetDevice(device.id)}
                              className="rounded-md bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-900 ring-1 ring-amber-300 hover:bg-amber-200 disabled:opacity-50"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => queueAction(device.id, "check-status")}
                              className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800 ring-1 ring-gray-300 hover:bg-gray-200 disabled:opacity-50"
                            >
                              {busy && device.pending_command === "CHECK_STATUS"
                                ? "Checking..."
                                : "Check Status"}
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => queueAction(device.id, "update")}
                              className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800 disabled:opacity-50"
                            >
                              {busy && device.pending_command === "UPDATE"
                                ? "Updating..."
                                : "Update"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
