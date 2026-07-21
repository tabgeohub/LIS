# Sigrid Accept List

## Jul21 accepted duplications

- `src/Types/keycloakUser.ts` <-> `backend/src/routes/keycloak/management/users/types.ts`
  Shared FE-BE contract twin kept intentionally aligned across runtimes.
- `src/Types/devices.ts` <-> `backend/src/routes/devices-updates/types.ts`
  Shared device payload/type twin accepted as an explicit cross-boundary mirror.
- `src/Types/installer.ts` <-> `backend/src/routes/installersStorage.ts`
  Shared installer type twin accepted as a stable transport contract.
- `src/hooks/flightPlan/pickFlightPlanPersistenceFields.ts` <-> `backend/src/helpers/queries/flight-plans/flightPlanFields.ts`
  FE-BE persistence field lists intentionally mirror the same stored plan shape.
- `src/helpers/points/pointCoreIdentityKeys.ts` <-> `backend/src/helpers/queries/points/pointCoreColumns.ts`
  Point core identity columns are intentionally mirrored between frontend helpers and backend query helpers.
- `src/Components/HomePage/Body/Left/Voorbereiding/DrawingTool/helpers/pickDrawingGeometryFormFields.ts` <-> `backend/src/helpers/queries/geometries/createGeometryInsert.ts`
  Geometry form fields and insert columns intentionally mirror the same persisted shape.
- `index.html` <-> `public/index.html`
  Vite and CRA entry shells are intentionally separate and should not be merged.

## Jul21 accepted facades

- `src/api-hooks/finishedPlans/usePlanPointAttachments.ts`
  This remains an intentional accepted facade that preserves a stable public import path while delegating implementation elsewhere.
