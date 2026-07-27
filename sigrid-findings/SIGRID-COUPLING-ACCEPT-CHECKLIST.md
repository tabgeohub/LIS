# Sigrid Accept — Module coupling `20260727(1)`

Source: [`module-coupling-findings-rijkswaterstaat-otg-lis-20260727(1).csv`](./module-coupling-findings-rijkswaterstaat-otg-lis-20260727(1).csv)

**Do not rewrite these hubs.** Fan-in is intentional shared infrastructure. Apply Accept in Sigrid UI.

## HIGH (2)

1. [ ] `src/hooks/useLogAction.ts` — fan-in 98
2. [ ] `src/hooks/useContent.ts` — fan-in 126

## MEDIUM (9)

1. [ ] `nnederlandLayerBuilders.ts` — fan-in 33
2. [ ] `useUpdateDataCore.ts` — fan-in 25
3. [ ] `backend/.../routeResponses.ts` — fan-in 23
4. [ ] `nnederlandIconPrimitives.tsx` — fan-in 26
5. [ ] `useWizardButtons.ts` — fan-in 32
6. [ ] `useConstSelectOptions.ts` — fan-in 26
7. [ ] `useResetFeatures.ts` — fan-in 23
8. [ ] EditGeometry `coords.ts` — fan-in 24
9. [ ] `validateMapView.ts` — fan-in 24

## LOW (13)

1. [ ] `keycloakAdminClient.ts` — fan-in 14
2. [ ] `resolveRegioFilter.ts` — fan-in 16
3. [ ] `useCreateDataCore.ts` — fan-in 13
4. [ ] `planWizardCore.ts` — fan-in 12
5. [ ] `drawingToolMapCleanup.ts` — fan-in 12
6. [ ] `authSecurityLog.ts` — fan-in 16
7. [ ] `getTransformedCoordinates.ts` — fan-in 18
8. [ ] `validateBody.ts` — fan-in 11
9. [ ] `attachmentDisplayUrl.ts` — fan-in 11
10. [ ] `useHandleCancel.ts` — fan-in 11
11. [ ] `fetchApi.ts` — fan-in 13
12. [ ] `useWizardCleanup.ts` — fan-in 13
13. [ ] `classNames.ts` — fan-in 20

**Total: 24 Accept**

Also Accept these interfacing findings that are **framework signatures** (cannot change without breaking Express/Multer):

- devices-updates `middleware` RequestHandler
- `requireAuthClientHeader`, `requirePassword`, `requireSessionAuth`, `legacyAuthUsageMonitor`, `realmAdminAuth`
- `installersUpload` / `reportUpload` fileFilter + filename callbacks
- `handleInstallerUploadMiddleware`
