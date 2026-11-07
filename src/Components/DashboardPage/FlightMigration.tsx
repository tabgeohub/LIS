import { useEffect, useState } from "react";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

type Flight = {
  id: string;
  vluchtnummer?: string;
  datum?: string;
  regio_id?: string;
  completion_count?: number;
};

const localDemoFlights: Flight[] = [
  { id: "local-finished-001", vluchtnummer: "DEMO-001", datum: "2026-11-03", regio_id: "Demo region", completion_count: 4 },
  { id: "local-finished-002", vluchtnummer: "DEMO-002", datum: "2026-10-28", regio_id: "Demo region", completion_count: 2 },
];

function isLocalBrowser() { return ["localhost", "127.0.0.1"].includes(window.location.hostname); }
function flightDate(value: string | undefined) { return value ? new Date(value).toLocaleDateString() : "—"; }

export default function FlightMigration() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [fixtureMode, setFixtureMode] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${getBackEndUrl()}/api/migrations/flights`, { credentials: "include", headers: { accept: "application/json" } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.code || "FINISHED_FLIGHTS_UNAVAILABLE");
        setFlights(data.flights || []);
      } catch {
        if (isLocalBrowser()) {
          setFixtureMode(true);
          setFlights(localDemoFlights);
          setNotice("Synthetic local preview data is shown because no local backend is running. It is not TST or PROD data.");
        } else setNotice("Finished flights are currently unavailable.");
      }
    };
    void load();
  }, []);

  return <section className="space-y-4">
    <h1 className="text-2xl font-semibold">Finished flight plans</h1>
    <p className="rounded bg-blue-50 p-3 text-blue-900">Read-only local view. It never creates tables, exports records, or transfers data.</p>
    {notice && <p className="rounded bg-amber-50 p-3 text-amber-900">{notice}</p>}
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-left">
        <thead><tr className="border-b"><th className="p-3">Flight</th><th className="p-3">Date</th><th className="p-3">Region</th><th className="p-3">Completed items</th><th className="p-3">Source</th></tr></thead>
        <tbody>{flights.map((flight) => <tr key={flight.id} className="border-b"><td className="p-3">{flight.vluchtnummer || flight.id}</td><td className="p-3">{flightDate(flight.datum)}</td><td className="p-3">{flight.regio_id || "—"}</td><td className="p-3">{flight.completion_count ?? "—"}</td><td className="p-3">{fixtureMode ? "Fixture" : "Local database"}</td></tr>)}</tbody>
      </table>
    </div>
  </section>;
}
