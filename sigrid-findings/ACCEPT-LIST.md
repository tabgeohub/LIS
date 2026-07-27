# ACCEPT-LIST — pack 20260727(1)

Generated from `all-findings-rijkswaterstaat-otg-lis-20260727(1)`.

## Do in Sigrid UI

- Full checklist: [SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md](SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md) (**192** items)
- Coupling only: [SIGRID-COUPLING-ACCEPT-CHECKLIST.md](SIGRID-COUPLING-ACCEPT-CHECKLIST.md) (**24**)

## Buckets

| Bucket | Count | Action |
| --- | --- | --- |
| Independence | 143 | Accept |
| Module coupling | 24 | Accept |
| Entanglement | 5 | Accept |
| Security Docker | 4 | Accept |
| Size dockerfile | 1 | Accept |
| Interfacing Express/Multer | 14 | Accept |
| OSH residual | 1 | Bump if possible else Accept |

## Do not Accept (code wave)

- Unit complexity McCabe 6–7 (7 units)
- Non-Express unit interfacing (options-object conversions)
- Size MEDIUM: FotoPanel, useGeometryGraphicsRendering, testResolveRegioFilter
