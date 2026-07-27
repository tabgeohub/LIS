# Sigrid-227 Accept checklist

Apply in Sigrid UI. Source: `sigrid-findings/sigrid-227`.

## Summary

| Bucket | Count |
| --- | --- |
| Independence | 143 |
| Module coupling | 24 |
| Entanglement | 5 |
| Security Docker | 2 |
| Duplication FE/BE | 9 |
| Size Accept | 2 |
| **Total** | **185** |

## Independence HIGH

1. [ ] `src/api-hooks/templateFlights/useTemplateFlights.ts` — Interface module with 36 lines of code
2. [ ] `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` — Interface module with 22 lines of code
3. [ ] `src/api-hooks/points/usePointLookupQueries.ts` — Interface module with 22 lines of code
4. [ ] `src/hooks/useLogAction.ts` — Interface module with 21 lines of code
5. [ ] `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` — Interface module with 19 lines of code
6. [ ] `src/hooks/consts/useConstSelectOptions.ts` — Interface module with 17 lines of code
7. [ ] `src/hooks/useGetFlightTimesDistance.ts` — Interface module with 14 lines of code
8. [ ] `src/api-hooks/consts/useLookupQuery.ts` — Interface module with 13 lines of code
9. [ ] `src/helpers/refreshToken.ts` — Interface module with 11 lines of code
10. [ ] `src/api-hooks/emails/useEmailsList.ts` — Interface module with 10 lines of code

## Independence MEDIUM (accept all)

1. [ ] `src/helpers/ArcGISHelpers/centerAndZoomMathCore.ts` (116 LOC)
2. [ ] `src/helpers/points/flightPlanPointExcelCore.ts` (82 LOC)
3. [ ] `src/helpers/ArcGISHelpers/geometryMapGraphicFactoriesCore.ts` (78 LOC)
4. [ ] `src/helpers/ArcGISHelpers/pointMapGraphicActionsCore.ts` (74 LOC)
5. [ ] `src/hooks/points/sortPointsWithSelectionOrderCore.ts` (70 LOC)
6. [ ] `src/helpers/ArcGISHelpers/geometryMapGraphicActionsCore.ts` (67 LOC)
7. [ ] `src/helpers/ArcGISHelpers/createGeometryGraphicInternal.ts` (66 LOC)
8. [ ] `src/helpers/ArcGISHelpers/bufferPointsOnLayerCore.ts` (61 LOC)
9. [ ] `src/helpers/tableExports/shapefileExportCore.ts` (60 LOC)
10. [ ] `src/hooks/zustand/tools/deletePointFormFields.ts` (59 LOC)
11. [ ] `src/helpers/tableExports/csvExportCore.ts` (59 LOC)
12. [ ] `src/api-hooks/mutations/useCreateDataCore.ts` (55 LOC)
13. [ ] `src/helpers/ArcGISHelpers/planBoundingBoxGeometryCore.ts` (54 LOC)
14. [ ] `src/hooks/flightPlan/submitCollectedFlightPlanCreate.ts` (52 LOC)
15. [ ] `src/hooks/filters/useFilteredSortedPlansCore.ts` (51 LOC)
16. [ ] `src/hooks/zustand/shared/flightPlanFormSettersCore.ts` (50 LOC)
17. [ ] `src/helpers/tableExports/xlsxExportCore.ts` (50 LOC)
18. [ ] `src/api-hooks/mutations/useUpdateDataCore.ts` (49 LOC)
19. [ ] `src/helpers/ArcGISHelpers/planStarGraphicsCore.ts` (47 LOC)
20. [ ] `src/api-hooks/mutations/useDeleteDataCore.ts` (45 LOC)
21. [ ] `src/helpers/ArcGISHelpers/bufferFlightPlansOnLayerCore.ts` (45 LOC)
22. [ ] `src/hooks/useTimeRangeCore.ts` (44 LOC)
23. [ ] `src/helpers/ArcGISHelpers/buildPlanBoundingBoxGraphicCore.ts` (44 LOC)
24. [ ] `src/helpers/ArcGISHelpers/pointGraphicCoordinates.ts` (43 LOC)
25. [ ] `src/helpers/ArcGISHelpers/pointMapGraphicFactoriesCore.ts` (43 LOC)
26. [ ] `src/hooks/layout/useResizableSidebarCore.ts` (41 LOC)
27. [ ] `src/helpers/ArcGISHelpers/pointGraphicFactoryCore.ts` (41 LOC)
28. [ ] `src/hooks/points/useWizardPointsFilterHeaderCore.tsx` (40 LOC)
29. [ ] `src/hooks/hover-click-handlers/useDrawPathCore.ts` (40 LOC)
30. [ ] `src/hooks/resultTab/useResultTabStarredPointActionsCore.ts` (39 LOC)
31. [ ] `src/hooks/hover-click-handlers/useNearestPointClickCore.ts` (38 LOC)
32. [ ] `src/helpers/ArcGISHelpers/finishedPlanCentroidMarkersCore.ts` (38 LOC)
33. [ ] `src/hooks/hover-click-handlers/useFeatureLayerPopupCore.ts` (38 LOC)
34. [ ] `src/helpers/tableExports/geoJsonExportCore.ts` (37 LOC)
35. [ ] `src/hooks/viewPlan/useMapPointSelectionClickCore.ts` (37 LOC)
36. [ ] `src/helpers/geo/buildCoordinateSyncPatchCore.ts` (35 LOC)
37. [ ] `src/hooks/flightPlan/flightPlanFormLabelsCore.ts` (34 LOC)
38. [ ] `src/hooks/resultTab/useResultTabMoreMenuCore.ts` (34 LOC)
39. [ ] `src/helpers/ArcGISHelpers/centerAndZoomFromPlanCore.ts` (32 LOC)
40. [ ] `src/helpers/ArcGISHelpers/syncBluePointGraphicsCore.ts` (32 LOC)
41. [ ] `src/hooks/resultTab/useResultTabTableViewCore.ts` (31 LOC)
42. [ ] `src/api-hooks/planImages/pointPlanImagesToAttachments.ts` (31 LOC)
43. [ ] `src/hooks/hover-click-handlers/useEditGeometryVerticesOnMap.ts` (30 LOC)
44. [ ] `src/hooks/flightPlan/flightPlanStandardSelectProps.ts` (30 LOC)
45. [ ] `src/helpers/ArcGISHelpers/flightPlanMapActions.ts` (30 LOC)
46. [ ] `src/hooks/flightPlan/pickFlightPlanPersistenceFields.ts` (30 LOC)
47. [ ] `src/hooks/features/useRenderGeometries.ts` (30 LOC)
48. [ ] `backend/src/configure/configureBodyParsersAndSwagger.ts` (29 LOC)
49. [ ] `src/hooks/flightPlan/assembleFlightPlanCreateAttributes.ts` (29 LOC)
50. [ ] `src/hooks/features/useRenderPoints.ts` (29 LOC)
51. [ ] `src/hooks/hover-click-handlers/useFeatureLayerLabels.ts` (28 LOC)
52. [ ] `src/helpers/points/buildPointUpdatePayload.ts` (28 LOC)
53. [ ] `src/hooks/popUpModal/useHandleClosePopUp.ts` (28 LOC)
54. [ ] `src/hooks/points/useHerhalenSelectionHandlers.ts` (28 LOC)
55. [ ] `src/hooks/features/useHoverPointsAndGeometries.ts` (26 LOC)
56. [ ] `src/hooks/features/useResetPointFilters.ts` (26 LOC)
57. [ ] `src/helpers/ArcGISHelpers/createMapView.ts` (25 LOC)
58. [ ] `src/hooks/filters/useFilterPoints.ts` (25 LOC)
59. [ ] `src/helpers/ArcGISHelpers/createYellowBorder.ts` (25 LOC)
60. [ ] `src/hooks/flightPlan/buildFlightPlanPayloadFields.ts` (24 LOC)
61. [ ] `src/hooks/wizard/useWizardButtons.ts` (24 LOC)
62. [ ] `src/helpers/ArcGISHelpers/getTransformedCoordinates.ts` (24 LOC)
63. [ ] `src/hooks/wizard/clearMapSelectionGraphics.ts` (24 LOC)
64. [ ] `src/hooks/hover-click-handlers/useDrawYellowMarkers.ts` (22 LOC)
65. [ ] `src/helpers/filterPlans.ts` (22 LOC)
66. [ ] `src/helpers/ArcGISHelpers/finishedPlanMapGraphics.ts` (22 LOC)
67. [ ] `src/hooks/hover-click-handlers/useGeometryClick.ts` (21 LOC)
68. [ ] `src/hooks/filters/useFilterPlans.ts` (21 LOC)
69. [ ] `src/hooks/hover-click-handlers/useDrawYellowGeometries.ts` (20 LOC)
70. [ ] `src/hooks/handleCancel/useCancelCreateFlightPlan.ts` (20 LOC)
71. [ ] `src/hooks/filters/useFilterGeometries.ts` (19 LOC)
72. [ ] `src/helpers/ArcGISHelpers/createPoint.ts` (19 LOC)
73. [ ] `src/helpers/points/herhalenSelection.ts` (19 LOC)
74. [ ] `src/helpers/ArcGISHelpers/createPin.ts` (19 LOC)
75. [ ] `src/helpers/points/sortPointsByImageCount.ts` (18 LOC)
76. [ ] `src/hooks/zustand/shared/planContentSelectionSetters.ts` (18 LOC)
77. [ ] `src/helpers/ArcGISHelpers/createYellowWgs84PointGraphic.ts` (18 LOC)
78. [ ] `src/hooks/hover-click-handlers/clearHoveredFlightPlanFromOriginalMap.ts` (18 LOC)
79. [ ] `src/hooks/flightPlan/usePopulateFlightPlanFormEffect.ts` (17 LOC)
80. [ ] `src/helpers/geo/applyCoordinateSyncPatchToSetters.ts` (17 LOC)
81. [ ] `src/hooks/features/useFetchInitialFeatures.ts` (17 LOC)
82. [ ] `src/helpers/points/starredPointSelection.ts` (17 LOC)
83. [ ] `src/helpers/ArcGISHelpers/pointHoverGraphics.ts` (16 LOC)
84. [ ] `src/api-hooks/planImages/usePointPlanImages.ts` (16 LOC)
85. [ ] `src/hooks/map/mapClickGuard.ts` (16 LOC)
86. [ ] `src/hooks/hover-click-handlers/useFinishedPlanMapHighlight.ts` (16 LOC)
87. [ ] `src/api-hooks/planImages/useGeometryPlanImages.ts` (16 LOC)
88. [ ] `src/helpers/ArcGISHelpers/createNewPointEvent.ts` (16 LOC)
89. [ ] `src/helpers/ArcGISHelpers/selectedGeometryGraphics.ts` (15 LOC)
90. [ ] `src/api-hooks/finishedPlans/useFinishedPlanQueries.ts` (15 LOC)
91. [ ] `src/hooks/hover-click-handlers/useGeometryListMapActions.ts` (15 LOC)
92. [ ] `src/hooks/handleCancel/useHandleClearFinishedPlan.ts` (15 LOC)
93. [ ] `src/hooks/hover-click-handlers/usePointListMapActions.ts` (15 LOC)
94. [ ] `src/helpers/arcgis/deleteArcgisAttachment.ts` (14 LOC)
95. [ ] `src/hooks/hover-click-handlers/useHoverFlightPlanFromOriginalMap.ts` (14 LOC)
96. [ ] `src/hooks/useResetTabs.ts` (14 LOC)
97. [ ] `src/hooks/zustand/pickEnrichedCoordinateControls.ts` (14 LOC)
98. [ ] `src/helpers/arcgis/attachmentDisplayUrl.ts` (13 LOC)
99. [ ] `src/helpers/getDistanceMeters.ts` (13 LOC)
100. [ ] `src/hooks/useMapInitialization.ts` (13 LOC)
101. [ ] `src/hooks/editPoint/useCoordinateSystemSync.ts` (13 LOC)
102. [ ] `src/hooks/useRenderVluchtPlans.ts` (13 LOC)
103. [ ] `src/lib/useDebouncedValue.ts` (13 LOC)
104. [ ] `src/hooks/viewPlan/useSortedPointSelection.ts` (12 LOC)
105. [ ] `src/hooks/features/useRenderLocalGeometries.ts` (12 LOC)
106. [ ] `src/helpers/geometry/matchesGeometryRepeat.ts` (12 LOC)
107. [ ] `src/hooks/zustand/shared/flightPlanFormValues.ts` (12 LOC)
108. [ ] `src/hooks/handleCancel/useHandleCancel.ts` (12 LOC)
109. [ ] `src/api-hooks/flightPlans/useRegionalFlightPlanQueries.ts` (11 LOC)
110. [ ] `src/helpers/getBackEndUrl.ts` (11 LOC)
111. [ ] `src/helpers/ArcGISHelpers/replaceGraphics.ts` (11 LOC)
112. [ ] `src/helpers/base64ToBlob.ts` (11 LOC)
113. [ ] `src/hooks/filters/filterPlanPoints.ts` (11 LOC)
114. [ ] `src/hooks/features/useResetFeatures.ts` (11 LOC)
115. [ ] `src/lib/invalidateAfterMutation.ts` (11 LOC)
116. [ ] `src/helpers/getLoginUrlWithReturn.ts` (10 LOC)
117. [ ] `src/hooks/hover-click-handlers/usePointHover.ts` (10 LOC)
118. [ ] `src/hooks/hover-click-handlers/useGeometryListHover.ts` (10 LOC)
119. [ ] `src/helpers/geo/transformWgs84ToRd.ts` (9 LOC)
120. [ ] `src/hooks/hover-click-handlers/usePointClick.ts` (9 LOC)
121. [ ] `src/hooks/popUpModal/usePopupController.ts` (8 LOC)
122. [ ] `src/api/fetchApi.ts` (8 LOC)
123. [ ] `src/helpers/ArcGISHelpers/validateMapView.ts` (7 LOC)
124. [ ] `src/hooks/wizard/useWizardCleanup.ts` (7 LOC)
125. [ ] `src/hooks/flightPlan/useFlightPlanFormSelectOptions.ts` (7 LOC)
126. [ ] `src/hooks/hover-click-handlers/useGeometryEditHighlight.ts` (6 LOC)
127. [ ] `src/hooks/hover-click-handlers/usePlanClick.ts` (6 LOC)
128. [ ] `src/hooks/hover-click-handlers/usePlanHover.ts` (6 LOC)
129. [ ] `src/hooks/useContent.ts` (5 LOC)
130. [ ] `src/hooks/bottom/useBottomCompactListView.ts` (4 LOC)
131. [ ] `src/helpers/haversine.ts` (4 LOC)
132. [ ] `src/helpers/isValidEmail.ts` (4 LOC)
133. [ ] `src/helpers/classNames.ts` (3 LOC)

## Module coupling

1. [ ] `src/hooks/useLogAction.ts` — fan-in 98 (HIGH)
2. [ ] `src/hooks/useContent.ts` — fan-in 126 (HIGH)
3. [ ] `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerBuilders.ts` — fan-in 33 (MEDIUM)
4. [ ] `src/api-hooks/mutations/useUpdateDataCore.ts` — fan-in 25 (MEDIUM)
5. [ ] `backend/src/helpers/http/routeResponses.ts` — fan-in 23 (MEDIUM)
6. [ ] `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandIconPrimitives.tsx` — fan-in 26 (MEDIUM)
7. [ ] `src/hooks/wizard/useWizardButtons.ts` — fan-in 32 (MEDIUM)
8. [ ] `src/hooks/consts/useConstSelectOptions.ts` — fan-in 26 (MEDIUM)
9. [ ] `src/hooks/features/useResetFeatures.ts` — fan-in 23 (MEDIUM)
10. [ ] `src/Components/HomePage/Body/Left/Tools/EditGeometry/EditForm/EditGeometryPointPanel/coords.ts` — fan-in 24 (MEDIUM)
11. [ ] `src/helpers/ArcGISHelpers/validateMapView.ts` — fan-in 24 (MEDIUM)
12. [ ] `backend/src/routes/keycloak/management/users/keycloakAdminClient.ts` — fan-in 14 (LOW)
13. [ ] `backend/src/helpers/queries/shared/resolveRegioFilter.ts` — fan-in 16 (LOW)
14. [ ] `src/api-hooks/mutations/useCreateDataCore.ts` — fan-in 13 (LOW)
15. [ ] `src/hooks/zustand/shared/planWizardCore.ts` — fan-in 12 (LOW)
16. [ ] `src/Components/HomePage/Body/Left/Voorbereiding/DrawingTool/helpers/drawingToolMapCleanup.ts` — fan-in 14 (LOW)
17. [ ] `backend/src/routes/auth2/authSecurityLog.ts` — fan-in 16 (LOW)
18. [ ] `src/helpers/ArcGISHelpers/getTransformedCoordinates.ts` — fan-in 18 (LOW)
19. [ ] `backend/src/helpers/http/validateBody.ts` — fan-in 11 (LOW)
20. [ ] `src/helpers/arcgis/attachmentDisplayUrl.ts` — fan-in 11 (LOW)
21. [ ] `src/hooks/handleCancel/useHandleCancel.ts` — fan-in 11 (LOW)
22. [ ] `src/api/fetchApi.ts` — fan-in 13 (LOW)
23. [ ] `src/hooks/wizard/useWizardCleanup.ts` — fan-in 13 (LOW)
24. [ ] `src/helpers/classNames.ts` — fan-in 20 (LOW)

## Entanglement

1. [ ] High communication density on src/api-hooks (MEDIUM)
2. [ ] Moderate communication density on src/helpers (LOW)
3. [ ] Moderate communication density on src/hooks (LOW)
4. [ ] Moderate communication density on src/Components/HomePage (LOW)
5. [ ] Moderate communication density on src/Components/TimesliderItemDetailPage (LOW)

## Security

1. [ ] `dockerfile#L22` — CWE-266 @ dockerfile#L22
2. [ ] `backend/dockerfile#L4` — CWE-266 @ backend/dockerfile#L4

## Duplication FE/BE

1. [ ] src/Types/keycloakUser.ts#L1:11,backend/src/routes/keycloak/management/users/types.ts#L1:11
2. [ ] backend/src/helpers/queries/flight-plans/flightPlanFieldNormalize.ts#L3:11,src/hooks/flightPlan/pickFlightPlanPersistenceFields.ts#L5:13
3. [ ] src/Types/devices.ts#L10:17,backend/src/routes/devices-updates/types.ts#L14:21
4. [ ] src/Types/devices.ts#L1:8,backend/src/routes/devices-updates/types.ts#L1:8
5. [ ] backend/src/helpers/queries/points/pointCoreColumns.ts#L3:10,src/helpers/points/pointCoreIdentityKeys.ts#L1:8
6. [ ] backend/src/helpers/queries/points/pointCoreColumns.ts#L4:9,src/helpers/points/pointCoreIdentityKeys.ts#L2:7,src/Components/HomePage/Body/Left/Common/PointDetailsFieldsList.tsx#L4:9
7. [ ] backend/src/helpers/queries/geometries/createGeometryInsert.ts#L4:9,src/Components/HomePage/Body/Left/Voorbereiding/DrawingTool/helpers/pickDrawingGeometryFormFields.ts#L3:8
8. [ ] src/Types/installer.ts#L1:7,backend/src/routes/installersStorage.ts#L4:10
9. [ ] index.html#L6:11,public/index.html#L6:11

## Size Accept

1. [ ] `backend/dockerfile#L1:86` — 59 lines of code for unit dockerfile
2. [ ] `backend/scripts/verify-regio-apis.ts#L59:117` — 56 lines of code for unit verify-regio-apis.ts.testResolveRegioFilter()
