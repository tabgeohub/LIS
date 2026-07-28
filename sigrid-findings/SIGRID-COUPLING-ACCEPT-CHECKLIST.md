# Sigrid coupling Accept checklist (Architecture sprint)

Source: pack `20260727(2)` Module coupling findings (all RAW).

Accept all **24** in Sigrid UI. Do **not** rewrite these hubs in code.

## HIGH

1. [ ] `src/hooks/useLogAction.ts` — fan-in 98 (21 LOC)
2. [ ] `src/hooks/useContent.ts` — fan-in 126 (5 LOC)

## MEDIUM

3. [ ] `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerBuilders.ts` — fan-in 33 (50 LOC)
4. [ ] `src/api-hooks/mutations/useUpdateDataCore.ts` — fan-in 25 (49 LOC)
5. [ ] `backend/src/helpers/http/routeResponses.ts` — fan-in 23 (41 LOC)
6. [ ] `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandIconPrimitives.tsx` — fan-in 26 (26 LOC)
7. [ ] `src/hooks/wizard/useWizardButtons.ts` — fan-in 32 (24 LOC)
8. [ ] `src/hooks/consts/useConstSelectOptions.ts` — fan-in 26 (17 LOC)
9. [ ] `src/hooks/features/useResetFeatures.ts` — fan-in 23 (11 LOC)
10. [ ] `src/Components/HomePage/Body/Left/Tools/EditGeometry/EditForm/EditGeometryPointPanel/coords.ts` — fan-in 24 (9 LOC)
11. [ ] `src/helpers/ArcGISHelpers/validateMapView.ts` — fan-in 24 (7 LOC)

## LOW

12. [ ] `backend/src/routes/keycloak/management/users/keycloakAdminClient.ts` — fan-in 14 (114 LOC)
13. [ ] `backend/src/helpers/queries/shared/resolveRegioFilter.ts` — fan-in 16 (~80 LOC)
14. [ ] `src/api-hooks/mutations/useCreateDataCore.ts` — fan-in 13 (55 LOC)
15. [ ] `src/hooks/zustand/shared/planWizardCore.ts` — fan-in 12 (51 LOC)
16. [ ] `src/Components/HomePage/Body/Left/Voorbereiding/DrawingTool/helpers/drawingToolMapCleanup.ts` — fan-in 12 (41 LOC)
17. [ ] `backend/src/routes/auth2/authSecurityLog.ts` — fan-in 16 (26 LOC)
18. [ ] `src/helpers/ArcGISHelpers/getTransformedCoordinates.ts` — fan-in 18 (24 LOC)
19. [ ] `backend/src/helpers/http/validateBody.ts` — fan-in 11 (20 LOC)
20. [ ] `src/helpers/arcgis/attachmentDisplayUrl.ts` — fan-in 11 (13 LOC)
21. [ ] `src/hooks/handleCancel/useHandleCancel.ts` — fan-in 11 (12 LOC)
22. [ ] `src/api/fetchApi.ts` — fan-in 13 (8 LOC)
23. [ ] `src/hooks/wizard/useWizardCleanup.ts` — fan-in 13 (7 LOC)
24. [ ] `src/helpers/classNames.ts` — fan-in 20 (3 LOC)
