# NEXT-FOCUS-STATUS — after Big Wave pack 20260727(2)

Updated after implementing the Sigrid Big Wave against
`sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260727(2)`.

## Code wave completed

- Unit complexity: further peeled `resolveSelectedPlan` + `resolveRealmRolesFromAuth`
- Unit size MEDIUM: thinned `useFotoPanelModel` (map/delete helpers); split `verify-regio-apis` helpers module
- Unit interfacing: options-object for `addIdsFromItems`, `pickStepText`, `resolvePlanGeometries`
- Duplication: already empty
- OSH `react-router-dom` CWE-601: still on latest `6.30.4` — **Accept**

## Accept in Sigrid UI (stars / Architecture)

Use:

- [ACCEPT-LIST.md](ACCEPT-LIST.md)
- [SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md](SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md) (~191 items)
- [SIGRID-COUPLING-ACCEPT-CHECKLIST.md](SIGRID-COUPLING-ACCEPT-CHECKLIST.md) (24 modules)

Buckets to Accept (no code rewrites planned):

| Bucket | Action |
| --- | --- |
| Independence (143) | Accept — no `*Core` façades / hub rewrites |
| Module coupling (24) | Accept — keep `useLogAction` / `useContent` hubs |
| Entanglement (5) | Accept |
| Security Docker CWE-266/CWE-250 (4) | Accept — no Dockerfile/Nginx edits |
| Size dockerfile MEDIUM | Accept |
| Interfacing Express/Multer | Accept — framework signatures |
| OSH react-router-dom CWE-601 | Accept until a CVE-clearing 6.x patch exists |

## Out of scope / do not grind

- ~691 unit size LOW findings
- Independence coupling entanglement code restructures
- Dockerfile / Nginx

## Regenerators

```bash
node tools/gen-sigrid-20260727-full-accept-checklist.mjs
```

Source pack path is hard-coded to `all-findings-rijkswaterstaat-otg-lis-20260727(2)`.
