import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import { useAuth } from "hooks/zustand/ui";

export default function MigratedFlightDetail() {
  const { id } = useParams();
  const user = useAuth(state => state.user);
  const [flight, setFlight] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    fetch(`${getBackEndUrl()}/api/finished_plans/getSingleFinishedFlightPlan/${encodeURIComponent(id)}`, { credentials: "include" })
      .then(async response => { if (!response.ok) throw new Error("Flight unavailable or outside your region"); return response.json(); })
      .then(data => setFlight(data.result ?? data))
      .catch(() => setError("Flight unavailable or outside your region"));
  }, [id]);
  if (user.role !== "admin" && !user.role?.startsWith("RWS ") && !user.role?.startsWith("EXT ")) return <p className="p-8">Sign in to view this flight.</p>;
  return <main className="mx-auto max-w-3xl p-8"><a href="/dashboard" className="text-blue-700 underline">Dashboard</a><h1 className="mt-4 text-2xl font-semibold">Production flight {id}</h1>{error && <p>{error}</p>}{flight && <dl className="mt-6 grid grid-cols-2 gap-4"><dt>Flight number</dt><dd>{String(flight.vluchtnummer ?? "—")}</dd><dt>Date</dt><dd>{String(flight.datum ?? "—")}</dd><dt>Region</dt><dd>{String(flight.regio_id ?? "—")}</dd><dt>Status</dt><dd>{String(flight.status ?? "—")}</dd></dl>}</main>;
}
