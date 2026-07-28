# ACCEPT-LIST — Architecture Accept sprint (pack 20260727)

Source: analysis of `all-findings-rijkswaterstaat-otg-lis-20260727(2)`  
(CSV pack not currently hydrated on disk; checklist rebuilt from prior pack-2 dump. Counts match your current Architecture board.)

**No new Sigrid export needed.** Do this in the Sigrid UI.

## Click order (Architecture stars)

1. Module coupling — **24** findings → [SIGRID-COUPLING-ACCEPT-CHECKLIST.md](SIGRID-COUPLING-ACCEPT-CHECKLIST.md)
2. Component entanglement — **5** findings → section in [SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md](SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md)
3. Component independence — **~143** (10 HIGH listed + Accept all MEDIUM via filter)

## Also Accept (same session)

| Bucket | Count | Action |
| --- | --- | --- |
| Security Docker CWE-266 / CWE-250 | 4 | Accept — no Dockerfile edits |
| OSH `react-router-dom` CWE-601 | 1 | Accept — already on latest 6.30.4 |
| Unit interfacing Express/Multer | ~13 | Accept — framework signatures |
| Size `backend/dockerfile` MEDIUM | 1 | Accept |

## Do not code-fix

- Independence `*Core` façades
- Rewriting `useLogAction` / `useContent` hubs
- Dockerfile / Nginx

## After Accept

Refresh Quality Overview. If Architecture is still yellow and **Data coupling ~0.5**, then export a fresh pack for a Data-coupling plan.
