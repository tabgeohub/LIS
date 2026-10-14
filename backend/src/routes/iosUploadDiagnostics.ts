import crypto from "node:crypto";
import type { Request, Response } from "express";

export type UploadStage = "photo" | "plan" | "logs" | "capability";
/** Only controlled text and allowlisted cause codes cross this boundary.
 * Never serialize Error.message, PG detail/query/parameters, provider bodies,
 * credentials, request contents or stack traces into a client response/log.
 */
export function uploadDiagnostic(stage: UploadStage, code: string, status: number, error?: unknown) {
  const raw = error && typeof error === "object" ? error as { code?: unknown; name?: unknown; message?: unknown } : {};
  const causes: Record<string, [string, string, string]> = {
    "42703": ["DB_COLUMN_UNAVAILABLE", "De database mist een bestaand veld dat deze backendversie verwacht.", "Laat de beheerder de backendversie en bestaande databasevelden controleren; wijzig geen database op basis van deze melding alleen."],
    "42P01": ["DB_RECORD_SOURCE_UNAVAILABLE", "Een bestaande gegevensbron voor deze upload is niet beschikbaar in de database.", "Laat de beheerder de gebruikte backendversie en databaseverbinding controleren."],
    "23502": ["DB_REQUIRED_VALUE_MISSING", "Een verplicht gegeven ontbreekt bij het opslaan.", "Bewaar het pakket en deel deze foutdetails voor onderzoek."],
    "23503": ["DB_REFERENCE_REJECTED", "Een verwijzing naar een vlucht, punt of bijlage is door de database afgewezen.", "Bewaar het pakket; laat de oorspronkelijke vlucht- en puntgegevens controleren."],
    "23505": ["DB_DUPLICATE_REJECTED", "De database heeft een dubbele registratie geweigerd.", "Controleer eerst de bestaande ontvangststatus; verzend niet opnieuw buiten de app."],
    "22P02": ["DB_INVALID_VALUE", "Een waarde heeft niet het formaat dat de database verwacht.", "Bewaar het pakket en deel deze details; de app mag de oorspronkelijke gegevens niet stilzwijgend aanpassen."],
    "22003": ["DB_VALUE_OUT_OF_RANGE", "Een getal past niet in het bestaande databaseveld.", "Bewaar het pakket en laat de aangeleverde waarden controleren."],
    "22007": ["DB_INVALID_TIMESTAMP", "Een datum of tijd heeft niet het verwachte formaat.", "De datum/tijd-projectie moet worden gecontroleerd; bewaar het pakket."],
    "22008": ["DB_INVALID_TIMESTAMP", "Een datum of tijd valt buiten het geldige bereik.", "De datum/tijd-projectie moet worden gecontroleerd; bewaar het pakket."],
    "42804": ["DB_VALUE_TYPE_MISMATCH", "Een aangeleverde waarde past niet bij het bestaande databaseveldtype.", "Bewaar het pakket en laat de gegevensprojectie controleren; verander niet zelf de database."],
    "42501": ["DB_PERMISSION_DENIED", "De backend heeft onvoldoende databaserechten voor deze bewerking.", "Laat de beheerder de bestaande toegangsrechten controleren."],
    "40001": ["DB_TRANSACTION_INTERRUPTED", "De databasetransactie kon niet worden afgerond door gelijktijdige verwerking.", "Controleer de ontvangststatus via Opnieuw proberen."],
    "40P01": ["DB_TRANSACTION_INTERRUPTED", "Gelijktijdige verwerking heeft de databasetransactie onderbroken.", "Controleer de ontvangststatus via Opnieuw proberen."],
    "ECONNREFUSED": ["DEPENDENCY_UNAVAILABLE", "De backend kon een benodigde dienst niet bereiken.", "Probeer later de ontvangststatus te controleren."],
    "ETIMEDOUT": ["DEPENDENCY_TIMEOUT", "Een benodigde dienst reageerde niet op tijd.", "De uitkomst kan onbekend zijn; gebruik alleen de statuscontrole in de app."],
    "57014": ["DB_REQUEST_TIMEOUT", "De databasebewerking is afgebroken of duurde te lang.", "Controleer de ontvangststatus voordat iets opnieuw wordt verzonden."],
    "ARCGIS_AUTH_REJECTED": ["ARCGIS_AUTH_REJECTED", "ArcGIS heeft de serveraanmelding of toegang geweigerd.", "Laat de beheerder de bestaande ArcGIS-aanmelding en laagrechten controleren; deel nooit een provider-token."],
    "ARCGIS_REQUEST_REJECTED": ["ARCGIS_REQUEST_REJECTED", "ArcGIS heeft deze fotobewerking afgewezen.", "Bewaar de originele foto en controleer de ontvangststatus; maak geen nieuwe feature buiten de app."],
    "ARCGIS_PROVIDER_UNCONFIGURED": ["ARCGIS_PROVIDER_UNCONFIGURED", "De vereiste ArcGIS-serverconfiguratie ontbreekt.", "Laat de beheerder de bestaande providerconfiguratie controleren; de foto blijft lokaal behouden."],
    "ARCGIS_LAYER_UNSUPPORTED": ["ARCGIS_LAYER_UNSUPPORTED", "De bestaande ArcGIS-laag meldt niet de vereiste foto- en aanmaakmogelijkheden.", "Laat de bestaande laagmogelijkheden en toegangsrechten controleren; pas geen laagschema aan op basis van deze melding alleen."],
  };
  let cause = typeof raw.code === "string" ? causes[raw.code] : undefined;
  if (!cause && typeof raw.message === "string" && ["ARCGIS_PROVIDER_UNCONFIGURED", "ARCGIS_LAYER_UNSUPPORTED"].includes(raw.message)) cause = causes[raw.message];
  if (!cause && raw.name === "TimeoutError") cause = causes.ETIMEDOUT;
  if (!cause && raw.message === "RECOVERY_SIGNING_UNAVAILABLE") cause = ["RECOVERY_SIGNING_UNAVAILABLE", "De backend kan geen veilige herstelbevestiging ondertekenen.", "Laat de beheerder de bestaande sessieconfiguratie controleren; deel nooit de sessiesleutel."];
  const pending = status === 202;
  const message = cause?.[1] ?? (status === 401 ? "Uw aanmelding is verlopen of ontbreekt." : status === 403 ? "Deze gebruiker heeft geen toegang tot deze bewerking." : status === 409 ? "De gegevens of herstelbevestiging komen niet overeen met de bestaande registratie." : status === 400 ? "De aangeleverde gegevens of foto voldoen niet aan het uploadcontract." : code.includes("UNCONFIGURED") ? "De vereiste server- of ArcGIS-functie is niet beschikbaar of niet geconfigureerd." : pending ? "De backend kan de ontvangst nog niet bewijzen; dit is geen bevestiging van aflevering." : "De backend kon deze bewerking niet bevestigen. De technische oorzaak is niet veilig vast te stellen uit deze reactie.");
  return { version: 1, stage, code, request_id: crypto.randomUUID(), timestamp: new Date().toISOString(),
    message, suggestion: cause?.[2] ?? (status === 401 ? "Meld u opnieuw aan met de oorspronkelijke pakketeigenaar." : "Bewaar het pakket. Gebruik Opnieuw proberen voor veilige statuscontrole; deel deze foutdetails als het probleem blijft bestaan."),
    cause_code: cause?.[0] ?? "UNCLASSIFIED", outcome: pending ? "pending" : status >= 500 ? "unknown" : "not_accepted" };
}

/** Scoped to iOS upload routes; legacy Website/Desktop responses stay untouched. */
export function uploadDiagnostics(stage: UploadStage) {
  return (_req: Request, res: Response, next: () => void): void => {
    const json = res.json.bind(res);
    res.json = ((body: any) => {
      const featureAcknowledgment = body?.outcome === "pending" && body?.feature_object_id && body?.recovery_context && !body?.code;
      if (res.statusCode >= 400 || (res.statusCode === 202 && !featureAcknowledgment)) {
        const code = typeof body?.code === "string" ? body.code : "UPLOAD_UNCONFIRMED";
        const diagnostic = body?.diagnostic || uploadDiagnostic(stage, code, res.statusCode, res.locals.uploadError);
        res.setHeader("X-LIS-Request-ID", diagnostic.request_id);
        console.error("[ios-upload]", { request_id: diagnostic.request_id, stage, code, cause_code: diagnostic.cause_code });
        return json({ ...body, code, message: diagnostic.message, diagnostic });
      }
      return json(body);
    }) as typeof res.json;
    next();
  };
}
