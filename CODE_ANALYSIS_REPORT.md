# Code Analysis Report - Duplicate Code, Unused Code, and Organization Issues

## 🔴 CRITICAL: Duplicate Code Patterns

### 1. **Geometry Rendering Logic - MAJOR DUPLICATION**
Multiple files contain nearly identical geometry rendering code:

**Files with duplicate geometry rendering:**
- `src/hooks/features/useRenderGeometries.ts` - Global geometry renderer
- `src/hooks/features/useRenderLocalGeometries.ts` - Local geometry renderer
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` - Lines 368-453 (blue geometries)
- `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/hooks/useRenderPlanGeometries.ts` - Finished plan geometries
- `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/Steps/Step2/hooks/useRenderGeometries.ts` - Report geometries
- `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/Step2/index.tsx` - ViewPlan geometries

**Common duplicated pattern:**
```typescript
// This pattern is repeated in 6+ files:
const ring = [...coordinates];
const first = ring[0];
const last = ring[ring.length - 1];
if (first[0] !== last[0] || first[1] !== last[1]) {
  ring.push([first[0], first[1]]);
}
const polygon = new Polygon({ rings: [ring], spatialReference: { wkid: 4326 } });
const fillSymbol = new SimpleFillSymbol({...});
```

**Recommendation:** Extract to `src/helpers/ArcGISHelpers/createGeometryGraphic.ts`

---

### 2. **Point Rendering Logic - DUPLICATION**
Similar point rendering code in multiple locations:

**Files with duplicate point rendering:**
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Step2/index.tsx` - Lines 102-161
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Step3/index.tsx` - Lines 102-161 (IDENTICAL CODE)
- `src/hooks/features/useRenderPoints.ts` - Global point renderer
- `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/hooks/useRenderPlanPoints.ts` - Finished plan points
- `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/index.tsx` - Lines 183-238

**Critical:** `AddPointsVluchtPlan/Step2/index.tsx` and `Step3/index.tsx` have **IDENTICAL** point rendering code (lines 102-161 in both files).

**Recommendation:** Extract to shared hook or utility function.

---

### 3. **Coordinate Transformation Pattern - REPEATED**
The coordinate transformation logic is repeated in many files:

**Files using getTransformedCoordinates with similar patterns:**
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Step2/index.tsx` - Lines 124-137
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Step3/index.tsx` - Lines 124-137 (IDENTICAL)
- `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/hooks/useRenderPlanGeometries.ts` - Lines 32-49
- `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/hooks/useRenderPlanPoints.ts` - Lines 38-55
- Multiple other files

**Pattern:**
```typescript
let lon: number | undefined = point.longitude;
let lat: number | undefined = point.latitude;
if ((typeof lon !== "number" || typeof lat !== "number") && 
    typeof point.xcoordinaat_rd === "number" && 
    typeof point.ycoordinaat_rd === "number") {
  const wgs = getTransformedCoordinates("RD", "WGS84", point.xcoordinaat_rd, point.ycoordinaat_rd);
  lon = wgs.x;
  lat = wgs.y;
}
```

**Recommendation:** Extract to `src/helpers/ArcGISHelpers/getPointCoordinates.ts`

---

### 4. **PointsList Components - MULTIPLE VARIATIONS**
Multiple PointsList components with similar but slightly different implementations:

**Files:**
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Common/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/TemplateFlight/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointToPlan/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/Step2/PointsList.tsx`
- `src/Components/HomePage/Body/Bottom/ClickedTableFunctions/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Common/ResultTab/PointsList.tsx`

**Common patterns:**
- All use `usePointHover` or similar hover logic
- All have sorting logic (lines 66-91 in FlightPlan, 86-111 in TemplateFlight)
- All have click handlers
- All use `useDrawYellowMarkers`

**Recommendation:** Create a shared `PointsList` component with props for customization.

---

### 5. **Yellow Geometry Drawing - DUPLICATE HOOK**
`useDrawYellowGeometries` is defined inside `GeometriesList.tsx` but could be shared:

**Location:**
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` - Lines 120-218

**Similar to:**
- `src/hooks/hover-click-handlers/useDrawYellowMarkers.ts` (for points)

**Recommendation:** Move `useDrawYellowGeometries` to `src/hooks/hover-click-handlers/useDrawYellowGeometries.ts` to match the pattern.

---

### 6. **Geometry Hover Logic - DUPLICATED**
Geometry hover logic is duplicated in multiple places:

**Files:**
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` - Lines 14-117 (useGeometryHover)
- `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/Steps/Step2/hooks/useGeometryHandlers.ts` - Lines 12-85
- `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/SingleGeometry.tsx` - Lines 19-116

**Recommendation:** Extract to `src/hooks/hover-click-handlers/useGeometryHover.ts` (similar to `usePointHover.ts`)

---

## 🟡 MEDIUM: Organization Issues

### 7. **Deep Import Paths**
Many files have very deep relative import paths:

**Examples:**
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Step3/index.tsx` imports from `../../../../../../../hooks/zustand/useAddPointStates`
- `src/Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/Steps/Step3/Buttons.tsx` imports from `../../../../../../../../hooks/zustand/useEnrichedPointState`
- `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useMapGraphics.ts` imports from `../../../../Left/Voorbereiding/ViewPlan/helpers/createQuadrantGraphic`

**Recommendation:** Use path aliases (already configured in tsconfig.json) or absolute imports from `src/`.

---

### 8. **Inconsistent File Structure**
Some components have inconsistent organization:

**Issues:**
- `AddPointsVluchtPlan` has both `Common/` folder and `Steps/` folder (but Steps is empty?)
- `FlightPlan` has `Common/` folder but also has components directly in `Steps/`
- Some components have `helpers/` folders, others don't
- `ViewPlan` has `helpers/` at the root level, but other similar components don't

**Recommendation:** Standardize folder structure across similar components.

---

### 9. **Buttons Components Scattered**
Many `Buttons.tsx` files in different locations:

**Count:** 50+ `Buttons.tsx` files across the project

**Pattern:**
- `Steps/Step1/Buttons.tsx`
- `Steps/Step2/Buttons.tsx`
- `Steps/Step3/Buttons.tsx`
- `Actions/Buttons.tsx`
- etc.

**Recommendation:** This is actually fine for organization, but consider if some button logic could be shared.

---

## 🟢 LOW: Potential Unused Code

### 10. **Empty or Unused Folders**
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Steps/` - Appears to be empty
- Check for other empty folders

### 11. **Unused Imports**
Need to check with linter, but common patterns suggest:
- Some files may import `useState` but not use it
- Some files may import components but not render them

**Recommendation:** Run ESLint with unused import detection.

---

## 📋 Summary of Recommendations

### High Priority:
1. ✅ Extract geometry rendering logic to shared utility
2. ✅ Extract point rendering logic to shared utility/hook
3. ✅ Extract coordinate transformation pattern to utility
4. ✅ Move `useDrawYellowGeometries` to hooks folder
5. ✅ Extract `useGeometryHover` to hooks folder
6. ✅ Consolidate duplicate code in `AddPointsVluchtPlan/Step2` and `Step3`

### Medium Priority:
7. ✅ Fix deep import paths using path aliases
8. ✅ Standardize folder structure across components
9. ✅ Consider shared PointsList component

### Low Priority:
10. ✅ Remove empty folders
11. ✅ Clean up unused imports (run linter)

---

## 📊 Statistics

- **Duplicate geometry rendering:** 6+ files
- **Duplicate point rendering:** 5+ files  
- **PointsList variations:** 8+ files
- **Buttons components:** 50+ files (acceptable)
- **Deep import paths:** 10+ files with 5+ levels

---

**Note:** This analysis was performed without modifying code. All recommendations should be reviewed and approved before implementation.


