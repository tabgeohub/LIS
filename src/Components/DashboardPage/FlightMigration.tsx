import { ChangeEvent, useEffect, useState } from "react";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

type Flight = { id: string; vluchtnummer?: string; datum?: string; regio_id?: string; completion_count?: number; migrationStatus?: string };
type Envelope = { payload: { source: { flightId: string; environment: string }; expiresAt: string }; digest: string; keyId: string; signature: string };
type Proposal = { ready: boolean; conflicts: string[]; mappings: { points: Array<{ action: string }>; geometries: Array<{ action: string }> }; counts: { points: number; geometries: number; completions: number; attachments: number; logs: number; hasPath: boolean } };
type Preview = { source: { flightId: string; flightNumber?: string; flightDate?: string | null }; region: string; proposal: Proposal };
type Mode = "source" | "destination" | "fixture" | null;

const localDemoFlights: Flight[] = [
  { id: "local-finished-001", vluchtnummer: "DEMO-001", datum: "2026-11-03", regio_id: "Demo region", completion_count: 4, migrationStatus: "Local preview" },
  { id: "local-finished-002", vluchtnummer: "DEMO-002", datum: "2026-10-28", regio_id: "Demo region", completion_count: 2, migrationStatus: "Local preview" },
];
function localBrowser() { return ["localhost", "127.0.0.1"].includes(window.location.hostname); }
function flightDate(value: string | null | undefined) { return value ? new Date(value).toLocaleDateString() : "—"; }
async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(`${getBackEndUrl()}/api/migrations${path}`, { credentials: "include", ...options, headers: { accept: "application/json", ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.code || "MIGRATION_REQUEST_FAILED");
  return data;
}

export default function FlightMigration() {
  const [mode, setMode] = useState<Mode>(null);
  const [csrf, setCsrf] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<{ destinationFlightId: string; region: string } | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const configured = await api("/mode");
        setMode(configured.mode);
        setCsrf(configured.csrfToken || "");
        if (configured.mode === "source") {
          const data = await api("/flights");
          setFlights(data.flights || []);
          setCsrf(data.csrfToken || configured.csrfToken || "");
        } else {
          const data = await api("/regions");
          setRegions(data.regions || []);
          setCsrf(data.csrfToken || configured.csrfToken || "");
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : "MIGRATION_REQUEST_FAILED";
        if (localBrowser()) {
          setMode("fixture");
          setFlights(localDemoFlights);
          setNotice("Synthetic local preview data is shown because no local backend is running. It is not TST or PROD data.");
        } else setNotice(`Flight transfer is unavailable in this environment (${reason}).`);
      }
    };
    void load();
  }, []);

  async function downloadExport(id: string) {
    setBusy(true); setNotice("");
    try {
      const data = await api(`/flights/${encodeURIComponent(id)}/exports`, { method: "POST", headers: { "x-lis-migration-csrf": csrf } });
      const blob = new Blob([JSON.stringify(data.envelope, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); link.download = data.fileName || `lis-finished-flight-${id}.json`; link.click();
      URL.revokeObjectURL(link.href);
      setNotice(`Signed package downloaded. It expires ${new Date(data.expiresAt).toLocaleString()}. Sign in to PROD and upload it there.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to create package"); }
    finally { setBusy(false); }
  }

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreview(null); setResult(null); setNotice("");
    if (!file) { setEnvelope(null); return; }
    try {
      const value = JSON.parse(await file.text()) as Envelope;
      if (!value?.payload?.source?.flightId || !value.digest || !value.keyId || !value.signature) throw new Error("INVALID_EXPORT");
      setEnvelope(value);
    } catch { setEnvelope(null); setNotice("This is not a valid LIS transfer package."); }
  }

  async function createPreview() {
    if (!envelope || !region) return;
    setBusy(true); setNotice("");
    try {
      const data = await api("/imports/preview", { method: "POST", headers: { "content-type": "application/json", "x-lis-migration-csrf": csrf }, body: JSON.stringify({ envelope, destinationRegion: region }) });
      setPreview(data);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to preview package"); }
    finally { setBusy(false); }
  }

  async function commitImport() {
    if (!envelope || !preview) return;
    setBusy(true); setNotice("");
    try {
      const data = await api("/imports", { method: "POST", headers: { "content-type": "application/json", "x-lis-migration-csrf": csrf }, body: JSON.stringify({ envelope, destinationRegion: preview.region }) });
      setResult(data);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Import failed"); }
    finally { setBusy(false); }
  }

  if (mode === "destination") return <section className="max-w-3xl space-y-5">
    <h1 className="text-2xl font-semibold">Import finished flight plan</h1>
    <p className="rounded bg-amber-50 p-3 text-amber-900">One-shot transfer: no import history is stored. If the import times out, do not retry it before checking PROD manually.</p>
    {notice && <p className="rounded bg-amber-50 p-3 text-amber-900">{notice}</p>}
    {result && <p className="rounded bg-green-50 p-3">Imported to <a className="underline" href={`/dashboard/flight/${encodeURIComponent(result.destinationFlightId)}`}>production flight {result.destinationFlightId}</a> in {result.region}.</p>}
    {!result && <><label className="block font-medium">Signed TST package<input className="mt-1 block w-full rounded border p-2" type="file" accept="application/json,.json" onChange={selectFile} /></label>
      {envelope && <p>Package flight: {envelope.payload.source.flightId}; expires: {new Date(envelope.payload.expiresAt).toLocaleString()}</p>}
      <label className="block font-medium">Production region<select className="mt-1 block w-full rounded border p-2" value={region} onChange={event => { setRegion(event.target.value); setPreview(null); }}><option value="">Select a region</option>{regions.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      {!preview && <button type="button" className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50" disabled={!envelope || !region || busy} onClick={createPreview}>Preview import</button>}
      {preview && <div className="space-y-3 rounded border bg-white p-4"><p>Flight: {preview.source.flightNumber || preview.source.flightId}; date: {flightDate(preview.source.flightDate)}</p><p>Points: {preview.proposal.counts.points}; geometries: {preview.proposal.counts.geometries}; completions: {preview.proposal.counts.completions}; photos: {preview.proposal.counts.attachments}; logs: {preview.proposal.counts.logs}.</p><p>Reused points: {preview.proposal.mappings.points.filter(item => item.action === "reuse").length}; new points: {preview.proposal.mappings.points.filter(item => item.action === "create").length}.</p>{preview.proposal.conflicts.length > 0 && <ul className="list-disc pl-5 text-red-700">{preview.proposal.conflicts.map(conflict => <li key={conflict}>{conflict}</li>)}</ul>}<button type="button" className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50" disabled={!preview.proposal.ready || busy} onClick={commitImport}>Import to PROD</button></div>}</>}
  </section>;

  return <section className="space-y-4">
    <h1 className="text-2xl font-semibold">Finished flight plans</h1>
    {mode === "fixture" ? <p className="rounded bg-blue-50 p-3 text-blue-900">Read-only local preview. It never exports or transfers data.</p> : <p className="rounded bg-amber-50 p-3 text-amber-900">Download a signed package for one finished flight. No package or transfer history is stored.</p>}
    {notice && <p className="rounded bg-amber-50 p-3 text-amber-900">{notice}</p>}
    <div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Flight</th><th className="p-3">Date</th><th className="p-3">Region</th><th className="p-3">Completed items</th><th className="p-3">Status</th><th className="p-3" /></tr></thead><tbody>{flights.map(flight => <tr key={flight.id} className="border-b"><td className="p-3">{flight.vluchtnummer || flight.id}</td><td className="p-3">{flightDate(flight.datum)}</td><td className="p-3">{flight.regio_id || "—"}</td><td className="p-3">{flight.completion_count ?? "—"}</td><td className="p-3">{flight.migrationStatus || "—"}</td><td className="p-3">{mode === "source" && <button type="button" className="rounded bg-blue-700 px-3 py-1 text-white disabled:opacity-50" disabled={busy || flight.migrationStatus === "Needs review"} onClick={() => downloadExport(flight.id)}>Download transfer package</button>}</td></tr>)}</tbody></table></div>
  </section>;
}
