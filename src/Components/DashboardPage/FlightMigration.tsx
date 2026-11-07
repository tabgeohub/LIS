import { useEffect, useMemo, useState } from "react";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

type Flight = { id: string; vluchtnummer?: string; datum?: string; regio_id?: string; migrationStatus: string };
type Proposal = { ready: boolean; conflicts: string[]; mappings: { points: Array<{ action: string }>; geometries: Array<{ action: string }> }; counts: { completions: number; attachments: number; logs: number; hasPath: boolean } };
const localDemoFlights: Flight[] = [
  { id: "local-finished-001", vluchtnummer: "DEMO-001", datum: "2026-11-03", regio_id: "Demo region", migrationStatus: "Status unavailable" },
  { id: "local-finished-002", vluchtnummer: "DEMO-002", datum: "2026-10-28", regio_id: "Demo region", migrationStatus: "Status unavailable" },
];
function isLocalBrowser() { return ["localhost", "127.0.0.1"].includes(window.location.hostname); }
async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(`${getBackEndUrl()}/api/migrations${path}`, { credentials: "include", ...options, headers: { accept: "application/json", ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.code || "MIGRATION_REQUEST_FAILED");
  return data;
}
function flightDate(value: string | undefined) { return value ? new Date(value).toLocaleDateString() : "—"; }

export default function FlightMigration() {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const sourceInstance = query.get("migrationSource"); const exportId = query.get("migrationExport");
  const [flights, setFlights] = useState<Flight[]>([]); const [regions, setRegions] = useState<string[]>([]); const [csrf, setCsrf] = useState(""); const [notice, setNotice] = useState(""); const [readOnly, setReadOnly] = useState(false);
  const [selected, setSelected] = useState(""); const [preview, setPreview] = useState<{ previewId: string; expiresAt: string; source: { environment: string; flightId: string; flightNumber?: string; flightDate?: string | null }; region: string; proposal: Proposal } | null>(null); const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ operationId: string; destinationFlightId: string; region: string; completedAt: string } | null>(null);
  const confirmation = Boolean(sourceInstance && exportId);
  useEffect(() => {
    const load = async () => {
      try {
        if (confirmation) { const data = await api("/regions"); setRegions(data.regions || []); setCsrf(data.csrfToken || ""); const savedId = sessionStorage.getItem(`migration-preview-${exportId}`); if (savedId) { try { const saved = await api(`/previews/${encodeURIComponent(savedId)}`); if (new Date(saved.expiresAt).getTime() > Date.now() || saved.committed) { setPreview(saved); setSelected(saved.region); if (saved.committed) setResult({ operationId: saved.committed.operation_id, destinationFlightId: saved.committed.destination_flight_id, region: saved.committed.destination_region, completedAt: saved.committed.completed_at }); } else sessionStorage.removeItem(`migration-preview-${exportId}`); } catch { sessionStorage.removeItem(`migration-preview-${exportId}`); } } }
        else { const data = await api("/flights"); setFlights(data.flights || []); setCsrf(data.csrfToken || ""); setReadOnly(Boolean(data.readOnly)); }
      } catch (error) {
        if (!confirmation && isLocalBrowser()) {
          setFlights(localDemoFlights); setReadOnly(true); setNotice("Local preview data is shown because no local backend is running. It is read-only and does not represent TST or PROD data.");
        } else setNotice(error instanceof Error && error.message === "MIGRATION_DISABLED" ? "Flight migration is disabled in this environment." : "Migration information is currently unavailable.");
      }
    }; void load();
  }, [confirmation]);
  async function prepare(id: string) {
    setBusy(true); setNotice("");
    try { const data = await api(`/flights/${encodeURIComponent(id)}/handoffs`, { method: "POST", headers: { "x-lis-migration-csrf": csrf } }); window.location.assign(data.handoffUrl); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Unable to prepare migration"); setBusy(false); }
  }
  async function createPreview() {
    if (!sourceInstance || !exportId || !selected) return; setBusy(true); setNotice("");
    try { const data = await api("/previews", { method: "POST", headers: { "content-type": "application/json", "x-lis-migration-csrf": csrf }, body: JSON.stringify({ sourceInstance, exportId, destinationRegion: selected }) }); setPreview(data); sessionStorage.setItem(`migration-preview-${exportId}`, data.previewId); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Unable to preview migration"); } finally { setBusy(false); }
  }
  async function commit() {
    if (!preview) return; setBusy(true); setNotice("");
    try { const data = await api(`/previews/${encodeURIComponent(preview.previewId)}/commit`, { method: "POST", headers: { "x-lis-migration-csrf": csrf } }); setResult(data); sessionStorage.setItem(`migration-operation-${preview.previewId}`, data.operationId); }
    catch (error) {
      const operationId = sessionStorage.getItem(`migration-operation-${preview.previewId}`) || preview.previewId;
      if (operationId) { try { const recovered = await api(`/operations/${encodeURIComponent(operationId)}`); setResult({ operationId, destinationFlightId: recovered.destination_flight_id, region: recovered.destination_region, completedAt: recovered.completed_at }); return; } catch {} }
      setNotice(error instanceof Error ? error.message : "Unable to commit migration; check the source migration status before retrying");
    } finally { setBusy(false); }
  }
  if (confirmation) return <section className="max-w-2xl space-y-5"><h1 className="text-2xl font-semibold">Confirm production migration</h1><p>Source environment: TST. Flight: {preview?.source.flightNumber || preview?.source.flightId || "loading…"}; date: {flightDate(preview?.source.flightDate || undefined)}</p>{notice && <p className="rounded bg-amber-50 p-3 text-amber-900">{notice}</p>}{result && <p className="rounded bg-green-50 p-3">Migrated to production flight <a className="underline" href={`/dashboard/flight/${encodeURIComponent(result.destinationFlightId)}`}>{result.destinationFlightId}</a> in {result.region} at {new Date(result.completedAt).toLocaleString()}.</p>}<label className="block font-medium">Destination region<select className="mt-1 block w-full rounded border p-2" disabled={Boolean(result)} value={selected} onChange={(event) => { setSelected(event.target.value); setPreview(null); }}><option value="">Select a region</option>{regions.map(region => <option key={region} value={region}>{region}</option>)}</select></label>{!preview && !result && <button type="button" disabled={!selected || busy} onClick={createPreview} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">Preview transfer</button>}{preview && <div className="space-y-3 rounded border bg-white p-4"><p>Reused points: {preview.proposal.mappings.points.filter(item => item.action === "reuse").length}; new points: {preview.proposal.mappings.points.filter(item => item.action === "create").length}</p><p>Reused geometries: {preview.proposal.mappings.geometries.filter(item => item.action === "reuse").length}; new geometries: {preview.proposal.mappings.geometries.filter(item => item.action === "create").length}</p><p>Observations: {preview.proposal.counts.completions}; photos: {preview.proposal.counts.attachments}; logs: {preview.proposal.counts.logs}; GPS/time: {preview.proposal.counts.hasPath ? "included" : "not saved"}</p>{preview.proposal.conflicts.length > 0 && <ul className="list-disc pl-5 text-red-700">{preview.proposal.conflicts.map(conflict => <li key={conflict}>{conflict}</li>)}</ul>}{!result && <button type="button" disabled={!preview.proposal.ready || busy} onClick={commit} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">Confirm migration to PROD: {preview.region}</button>}</div>}</section>;
  return <section className="space-y-4"><h1 className="text-2xl font-semibold">Flight migration</h1><p className="text-sm text-gray-600">Ready means a saved, finished flight is eligible for review. It does not confirm device delivery.</p>{readOnly && <p className="rounded bg-blue-50 p-3 text-blue-900">Local mode: finished flights are visible; migrations are disabled.</p>}{notice && <p className="rounded bg-amber-50 p-3 text-amber-900">{notice}</p>}<div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Flight</th><th className="p-3">Date</th><th className="p-3">Source region</th><th className="p-3">Migration</th><th className="p-3" /></tr></thead><tbody>{flights.map(flight => <tr key={flight.id} className="border-b"><td className="p-3">{flight.vluchtnummer || flight.id}</td><td className="p-3">{flightDate(flight.datum)}</td><td className="p-3">{flight.regio_id || "—"}</td><td className="p-3">{flight.migrationStatus}</td><td className="p-3"><button type="button" disabled={readOnly || busy || flight.migrationStatus.startsWith("Migrated") || flight.migrationStatus === "Needs review"} onClick={() => prepare(flight.id)} className="rounded bg-blue-700 px-3 py-1 text-white disabled:opacity-50">Migrate to PROD</button></td></tr>)}</tbody></table></div></section>;
}
