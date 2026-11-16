import { type ChangeEvent, useEffect, useState } from "react";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

type Envelope = {
  payload: { source: { flightId: string; environment: string }; expiresAt: string };
  digest: string;
  keyId: string;
  signature: string;
};
type Proposal = {
  ready: boolean;
  conflicts: string[];
  mappings: { points: Array<{ sourceId: string; action: string; sourceName: string; destinationName: string; renamed: boolean }>; geometries: Array<{ action: string }> };
  counts: { points: number; geometries: number; completions: number; attachments: number; sourceLogsSkipped: number; hasPath: boolean };
};
type Preview = { source: { flightId: string; flightNumber?: string; flightDate?: string | null }; region: string; proposal: Proposal };

class MigrationRequestError extends Error {
  constructor(readonly code: string, message: string) { super(message); }
}

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(`${getBackEndUrl()}/api/migrations${path}`, {
    credentials: "include",
    ...options,
    headers: { accept: "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new MigrationRequestError(data.code || "MIGRATION_REQUEST_FAILED", data.message || data.code || "MIGRATION_REQUEST_FAILED");
  return data;
}

const date = (value: string | null | undefined) => value ? new Date(value).toLocaleDateString() : "—";
const count = (items: Array<{ action: string }>, action: string) => items.filter(item => item.action === action).length;

/** PROD-only manual package importer. It intentionally keeps no import history or retry state. */
export default function ImportFinishedFlightPlan() {
  const [csrf, setCsrf] = useState("");
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
        const mode = await api("/mode");
        if (mode.mode !== "destination") throw new Error("MIGRATION_DISABLED");
        const available = await api("/regions");
        setCsrf(available.csrfToken || mode.csrfToken || "");
        setRegions(available.regions || []);
        if (!(available.regions || []).length) setNotice("No production regions match your exact realm roles.");
      } catch (error) {
        setNotice(`Finished-flight import is unavailable (${error instanceof Error ? error.message : "MIGRATION_REQUEST_FAILED"}).`);
      }
    };
    void load();
  }, []);

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreview(null); setResult(null); setNotice("");
    if (!file) { setEnvelope(null); return; }
    try {
      const candidate = JSON.parse(await file.text()) as Envelope;
      if (!candidate?.payload?.source?.flightId || !candidate.digest || !candidate.keyId || !candidate.signature) throw new Error("INVALID_EXPORT");
      setEnvelope(candidate);
    } catch { setEnvelope(null); setNotice("This file is not a valid LIS signed transfer package."); }
  }

  async function previewImport() {
    if (!envelope || !region) return;
    setBusy(true); setNotice(""); setPreview(null);
    try {
      setPreview(await api("/imports/preview", { method: "POST", headers: { "content-type": "application/json", "x-lis-migration-csrf": csrf }, body: JSON.stringify({ envelope, destinationRegion: region }) }));
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to preview this package"); }
    finally { setBusy(false); }
  }

  async function importFlight() {
    if (!envelope || !preview?.proposal.ready || busy || result) return;
    setBusy(true); setNotice("");
    try {
      const confirmedRenames = preview.proposal.mappings.points.filter(point => point.renamed).map(({ sourceId, destinationName }) => ({ sourceId, destinationName }));
      setResult(await api("/imports", { method: "POST", headers: { "content-type": "application/json", "x-lis-migration-csrf": csrf }, body: JSON.stringify({ envelope, destinationRegion: preview.region, confirmedRenames }) }));
    } catch (error) {
      if (error instanceof MigrationRequestError && error.code === "PREVIEW_CHANGED") {
        setPreview(null);
        setNotice("Production point names changed. Preview the package again to review the updated names before importing.");
      } else setNotice(error instanceof Error ? error.message : "Import failed");
    }
    finally { setBusy(false); }
  }

  return <section className="max-w-3xl space-y-5">
    <h1 className="text-2xl font-semibold">Import finished flight plan</h1>
    <p className="rounded bg-amber-50 p-3 text-amber-900">No package or import history is stored. If the request times out, check PROD manually before trying again.</p>
    {notice && <p className="rounded bg-amber-50 p-3 text-amber-900">{notice}</p>}
    {result ? <p className="rounded bg-green-50 p-3 text-green-900">Imported to <a className="underline" href={`/dashboard/flight/${encodeURIComponent(result.destinationFlightId)}`}>production flight {result.destinationFlightId}</a> in {result.region}.</p> : <>
      <label className="block font-medium">Signed TST package<input className="mt-1 block w-full rounded border p-2" type="file" accept="application/json,.json" disabled={busy} onChange={selectFile} /></label>
      {envelope && <p>Package flight: {envelope.payload.source.flightId}; expires: {new Date(envelope.payload.expiresAt).toLocaleString()}.</p>}
      <label className="block font-medium">Production region<select className="mt-1 block w-full rounded border p-2" value={region} disabled={busy} onChange={event => { setRegion(event.target.value); setPreview(null); }}><option value="">Select a region</option>{regions.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      {!preview && <button type="button" className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50" disabled={!envelope || !region || busy} onClick={previewImport}>Preview import</button>}
      {preview && <div className="space-y-3 rounded border bg-white p-4">
        <p>Flight: {preview.source.flightNumber || preview.source.flightId}; date: {date(preview.source.flightDate)}; selected PROD region: {preview.region}.</p>
        <p>Points: {preview.proposal.counts.points}; geometries: {preview.proposal.counts.geometries}; completions: {preview.proposal.counts.completions}; attachments: {preview.proposal.counts.attachments}; path: {preview.proposal.counts.hasPath ? "yes" : "no"}. Source logs skipped: {preview.proposal.counts.sourceLogsSkipped}.</p>
        <p>Points reused/new: {count(preview.proposal.mappings.points, "reuse")}/{count(preview.proposal.mappings.points, "create")}; geometries reused/new: {count(preview.proposal.mappings.geometries, "reuse")}/{count(preview.proposal.mappings.geometries, "create")}.</p>
        {preview.proposal.mappings.points.some(point => point.renamed) && <div><p>These Ad hoc points will be created with new names:</p><ul className="list-disc pl-5">{preview.proposal.mappings.points.filter(point => point.renamed).map(point => <li key={point.sourceId}>{point.sourceName} → {point.destinationName}</li>)}</ul></div>}
        {preview.proposal.conflicts.length > 0 && <ul className="list-disc pl-5 text-red-700">{preview.proposal.conflicts.map(conflict => <li key={conflict}>{conflict}</li>)}</ul>}
        <button type="button" className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50" disabled={!preview.proposal.ready || busy} onClick={importFlight}>Import to PROD</button>
      </div>}
    </>}
  </section>;
}
