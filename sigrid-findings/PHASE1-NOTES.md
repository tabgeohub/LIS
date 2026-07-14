# Phase 1 duplication notes

## Baseline

- Source export: `sigrid findings/Duplication findings.csv` (2026-07-13)
- Open HIGH findings: 147
- Stable clone identifiers: `sigrid findings/Duplicates.csv`
- Phase 0 security commit: `222d410`

The Phase 1 refactors are intentionally behavior-preserving. A fresh Sigrid export is required to obtain the authoritative cleared/new count because clone locations and overlapping findings change after extraction.

## Accepted duplication

These clone IDs should be marked accepted if they remain in the next export:

| Clone ID | Reason |
| --- | --- |
| `e693dac9-7ed2-47cf-b948-d3c375fc612b` | The Keycloak user type crosses the independent frontend/backend package and Docker build boundary. Sharing it requires a separately versioned shared package and is outside a behavior-preserving refactor. |
| `ac571526-c45b-4cd6-b28e-1001897bcc4c` | The four flight-plan route functions are intentionally thin endpoint configurations. Query construction, database access, filtering, transformation, and error handling already live in `fetchFlightPlanList`. Collapsing the route exports would hide distinct public endpoint policies. |
| `1ddb37ab-2814-4a24-b5fa-68ecf1b7854d` | The repeated names are a hook parameter destructure and its React dependency list. They are not duplicated executable behavior; removing the explicit dependency list would weaken effect correctness. |
| `ddc87ac3-8442-49c7-9504-1e93055a9517` | Point fields are repeated across a frontend transport type and a backend runtime validator. They cannot share runtime code across the current package boundary. |
| `da5a29e7-4678-466f-9037-db8c71661fc0` | Same frontend/backend schema-boundary case as above. Keep the runtime validator independent from browser types. |
| `cf27af59-258e-47fb-98f8-0b0d3138eb39` | Same frontend/backend schema-boundary case as above. A future generated schema package can replace this accepted duplication. |

## Re-scan

Place the next export in `sigrid-findings/exported-findings-8/`, then run:

```powershell
py -3 sigrid-findings/compare-exports-pair.py "sigrid findings" exported-findings-8
```

Python is not installed in the current workstation environment, so the restored comparison script was reviewed but could not be executed locally.
