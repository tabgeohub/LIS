import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function TimesliderItemDetailPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const parsed = useMemo(() => {
    const kind = searchParams.get("kind");
    const idRaw = searchParams.get("id");
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";
    const id = idRaw ? parseInt(idRaw, 10) : NaN;
    const validKind = kind === "point" || kind === "geometry";
    return {
      kind: validKind ? kind : null,
      id: Number.isFinite(id) && id > 0 ? id : null,
      from,
      to,
    };
  }, [searchParams]);

  const queryValid = parsed.kind != null && parsed.id != null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">
            ← Terug naar de kaart
          </Link>
        </p>

        <h1 className="text-lg font-semibold text-gray-900">
          Timeslider — item uit URL
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gegevens uit de querystring. Authenticatie volgt dezelfde sessie als de
          hoofdapplicatie (nieuw tabblad, zelfde domein).
        </p>

        <section className="mt-6 border-t border-gray-100 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            URL-parameters
          </h2>
          {!queryValid ? (
            <p className="mt-2 text-sm text-amber-700">
              Ongeldige of ontbrekende parameters. Verwacht:{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">
                kind=point|geometry
              </code>
              , <code className="rounded bg-gray-100 px-1 text-xs">id</code>,{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">from</code>,{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">to</code>.
            </p>
          ) : (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium capitalize">{parsed.kind}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">Id</dt>
                <dd className="font-mono font-medium">{parsed.id}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">Van (from)</dt>
                <dd className="font-mono">{parsed.from || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">Tot (to)</dt>
                <dd className="font-mono">{parsed.to || "—"}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="mt-6 border-t border-gray-100 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Ingelogde gebruiker
          </h2>
          {user.user_id === 0 ? (
            <p className="mt-2 text-sm text-gray-600">
              Sessie wordt geladen… Als dit blijft staan, open deze pagina via de
              app terwijl u bent ingelogd, of ga naar de{" "}
              <Link to="/" className="text-primary hover:underline">
                startpagina
              </Link>
              .
            </p>
          ) : (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">Gebruikersnaam</dt>
                <dd className="font-medium">{user.user_name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">E-mail</dt>
                <dd className="font-medium">{user.email ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 py-1">
                <dt className="text-gray-500">Rol / regio</dt>
                <dd className="font-medium">{user.role || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-gray-500">User id</dt>
                <dd className="font-mono text-xs">{String(user.user_id)}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>
    </div>
  );
}
