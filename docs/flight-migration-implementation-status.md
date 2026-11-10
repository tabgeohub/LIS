# One-shot finished-flight transfer: implementation status

The implementation uses no migration SQL, tables, or additional business fields. It exports a signed, expiry-bound package from TST without persisting it. PROD verifies the package, validates the selected region and photo references, recomputes a preview, and imports the business records in one transaction.

The deliberate trade-off is that there is no durable transfer record, source-to-PROD mapping, duplicate prevention, or recovery after a lost response. The admin must inspect PROD before retrying an uncertain import. `localhost` remains read-only and uses fixtures when no local backend is configured.

No deployment, live schema inspection, Keycloak role validation, ArcGIS/provider validation, or real data transfer has been performed. Those remain release gates.
