import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

export default function MigratedFlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState<Record<string, unknown> | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    void fetch(`${getBackEndUrl()}/api/finished_plans/getSingleFinishedFlightPlan/${encodeURIComponent(id)}`, { credentials: "include" })
      .then(response => response.ok ? response.json() : null)
      .then(setFlight)
      .catch(() => setFlight(null));
  }, [id]);

  return <main className="min-h-screen bg-gray-50 p-8">
    <Link className="text-blue-700 underline" to="/dashboard">Back to Import finished flight plan</Link>
    <h1 className="mt-4 text-2xl font-semibold">Production flight {id}</h1>
    {flight === undefined && <p className="mt-4">Loading…</p>}
    {flight === null && <p className="mt-4 rounded bg-amber-50 p-3 text-amber-900">The production flight could not be found or is not available to this session.</p>}
    {flight && <dl className="mt-4 grid max-w-xl grid-cols-2 gap-3 rounded border bg-white p-4"><dt>Flight number</dt><dd>{String(flight.vluchtnummer ?? "—")}</dd><dt>Date</dt><dd>{String(flight.datum ?? "—")}</dd><dt>Region</dt><dd>{String(flight.regio_id ?? "—")}</dd><dt>Status</dt><dd>{String(flight.status ?? "—")}</dd></dl>}
  </main>;
}
