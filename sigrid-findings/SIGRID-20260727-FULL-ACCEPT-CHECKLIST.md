# Sigrid-20260727 FULL Accept checklist (Architecture sprint)

Apply in **Sigrid UI**. Rebuilt for the Architecture Accept sprint from pack `20260727(2)` analysis (CSV folder not hydrated on disk).

**Do not code-fix:** Independence `*Core` façades, high fan-in hubs, Docker/Nginx.

## Summary

| Bucket | Count | Action |
| --- | --- | --- |
| Module coupling | 24 | Accept (see coupling checklist) |
| Entanglement | 5 | Accept |
| Independence HIGH | 10 | Accept |
| Independence MEDIUM | ~133 | Accept all via Sigrid filter |
| Security Docker | 4 | Accept |
| OSH react-router-dom | 1 | Accept |
| Size dockerfile | 1 | Accept |
| Interfacing Express/Multer | ~13 | Accept |

## 1. Module coupling (24)

See [SIGRID-COUPLING-ACCEPT-CHECKLIST.md](SIGRID-COUPLING-ACCEPT-CHECKLIST.md) — Accept all.

## 2. Entanglement (5)

1. [ ] High communication density on `src/api-hooks` (MEDIUM)
2. [ ] Moderate communication density on `src/helpers` (LOW)
3. [ ] Moderate communication density on `src/hooks` (LOW)
4. [ ] Moderate communication density on `src/Components/HomePage` (LOW)
5. [ ] Moderate communication density on `src/Components/TimesliderItemDetailPage` (LOW)

## 3. Independence HIGH (10)

1. [ ] `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` — interface module (42 LOC)
2. [ ] `src/api-hooks/templateFlights/useTemplateFlights.ts` — interface module (36 LOC)
3. [ ] `src/api-hooks/points/usePointLookupQueries.ts` — interface module (22 LOC)
4. [ ] `src/hooks/useLogAction.ts` — interface module (21 LOC)
5. [ ] `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` — interface module (19 LOC)
6. [ ] `src/hooks/consts/useConstSelectOptions.ts` — interface module (17 LOC)
7. [ ] `src/hooks/useGetFlightTimesDistance.ts` — interface module (14 LOC)
8. [ ] `src/api-hooks/consts/useLookupQuery.ts` — interface module (13 LOC)
9. [ ] `src/helpers/refreshToken.ts` — interface module (11 LOC)
10. [ ] `src/api-hooks/emails/useEmailsList.ts` — interface module (10 LOC)

## 4. Independence MEDIUM (~133)

In Sigrid Findings:

1. Filter **Component independence**
2. Severity = **MEDIUM**, Status = **RAW**
3. Select all → **Accept**

(Bulk Accept is faster than clicking ~133 one-by-one.)

## 5. Security Docker (Accept — no Dockerfile edits)

1. [ ] `dockerfile#L22` — CWE-266 Missing User Instruction
2. [ ] `backend/dockerfile#L4` — CWE-266 Missing User Instruction
3. [ ] `backend/dockerfile#L85` — CWE-250 runs as root
4. [ ] `dockerfile#L32` — CWE-250 runs as root

## 6. Security OSH residual

1. [ ] `package-lock.json` — `react-router-dom` CWE-601 (CVE-2026-53668) — Accept (latest 6.x is 6.30.4)

## 7. Size Accept

1. [ ] `backend/dockerfile` — unit size MEDIUM (59 LOC)

## 8. Interfacing Express/Multer (Accept — framework signatures)

1. [ ] `backend/src/routes/devices-updates/middleware.ts` — `attachDeviceFromToken` / RequestHandler
2. [ ] `backend/src/routes/auth2/requireAuthClientHeader.ts`
3. [ ] `backend/src/helpers/auth/requirePassword.ts`
4. [ ] `backend/src/routes/installersHandlers.ts` — `handleInstallerUploadMiddleware`
5. [ ] `backend/src/helpers/auth/requireSessionAuth.ts`
6. [ ] `backend/src/helpers/auth/legacyAuthUsageMonitor.ts`
7. [ ] `backend/src/routes/installersUpload.ts` — `fileFilter` / `filename`
8. [ ] `backend/src/helpers/auth/realmAdminAuth.ts` — `requireAdmin`
9. [ ] `backend/src/routes/reportUpload.ts` — `filename` / `fileFilter`

(Any remaining Express/Multer 3-param units in Unit interfacing → Accept the same way.)
