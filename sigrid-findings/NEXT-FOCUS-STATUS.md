# NEXT-FOCUS-STATUS — after Big Wave pack 20260727(1)

Updated after implementing the Sigrid Big Wave against
`sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260727(1)`.

## Code wave completed

- Unit complexity: thinned all 7 McCabe 6–7 RAW units
- Unit interfacing: options-object for non-Express units (incl. `classifyRoleChange` MEDIUM)
- Unit size MEDIUM: `testResolveRegioFilter` cases hoisted; `FotoPanel` split; `renderDefaultGeometries` extracted
- Duplication: already empty in this pack (no Dup work)
- OSH `react-router-dom` CWE-601: still on latest `6.30.4` — **Accept** (no newer 6.x patch; do not jump to v7)

## Accept in Sigrid UI (stars / Architecture)

Use:

- [ACCEPT-LIST.md](ACCEPT-LIST.md)
- [SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md](SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md) (~192 items)
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

- ~686 unit size LOW findings
- Independence coupling entanglement code restructures
- Dockerfile / Nginx

## Regenerators

```bash
node tools/gen-sigrid-20260727-full-accept-checklist.mjs
```

Source pack path is hard-coded to `all-findings-rijkswaterstaat-otg-lis-20260727(1)`.
