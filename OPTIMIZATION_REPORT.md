# Code Optimization Report

## 🔴 HIGH PRIORITY: Duplicate Code Patterns

### 1. **Yellow Marker Symbol Creation - DUPLICATED 4+ TIMES**
**Pattern:** Creating identical yellow SimpleMarkerSymbol in multiple files

**Files with duplicate code:**
- `src/hooks/hover-click-handlers/useDrawYellowMarkers.ts` (lines 43-51)
- `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useMapGraphics.ts` (lines 52-57)
- `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/index.tsx` (lines 191-199)
- `src/Components/HomePage/Body/Common/PopupModal/createYellowCircle.ts` (lines 13-21)

**Duplicate code:**
```typescript
const yellow = new SimpleMarkerSymbol({
  color: "yellow",
  size: 12,
  style: "circle",
  outline: {
    color: "white",
    width: 1,
  },
});
```

**Recommendation:** Extract to `src/helpers/ArcGISHelpers/createSymbols.ts`:
```typescript
export const YELLOW_MARKER_SYMBOL = new SimpleMarkerSymbol({
  color: "yellow",
  size: 12,
  style: "circle",
  outline: { color: "white", width: 1 },
});
```

**Impact:** Remove ~40 lines of duplicate code, improve performance (symbol created once)

---

### 2. **Starred Point Symbol - DUPLICATED 3+ TIMES**
**Pattern:** Creating identical starred point symbol (transparent fill, blue outline)

**Files with duplicate code:**
- `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useMapGraphics.ts` (lines 79-84)
- `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/index.tsx` (lines 223-231)

**Duplicate code:**
```typescript
new SimpleMarkerSymbol({
  style: "circle",
  size: 14,
  color: [255, 255, 255, 0],
  outline: { color: [0, 0, 255, 1], width: 2 },
})
```

**Recommendation:** Extract to `src/helpers/ArcGISHelpers/createSymbols.ts`:
```typescript
export const STARRED_POINT_SYMBOL = new SimpleMarkerSymbol({
  style: "circle",
  size: 14,
  color: [255, 255, 255, 0],
  outline: { color: [0, 0, 255, 1], width: 2 },
});
```

**Impact:** Remove ~20 lines of duplicate code

---

### 3. **MapView/GraphicsLayer Validation Pattern - REPEATED 15+ TIMES**
**Pattern:** Checking if mapView and graphicsLayer exist before operations

**Files with this pattern:**
- `src/hooks/hover-click-handlers/useDrawYellowMarkers.ts` (line 27)
- `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useMapGraphics.ts` (lines 47, 93)
- `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/index.tsx` (line 186)
- And 12+ more files

**Duplicate code:**
```typescript
if (!mapView || !yellowGraphicsLayer) return;
```

**Recommendation:** Create utility function:
```typescript
// src/helpers/ArcGISHelpers/validateMapView.ts
export function validateMapView(
  mapView: any,
  ...layers: any[]
): boolean {
  if (!mapView) return false;
  return layers.every(layer => layer !== null && layer !== undefined);
}
```

**Impact:** Standardize validation, reduce errors

---

### 4. **removeAll() + addMany() Pattern - REPEATED 10+ TIMES**
**Pattern:** Clearing graphics layer then adding new graphics

**Files with this pattern:**
- `src/hooks/features/useRenderLocalGeometries.ts` (lines 17, 28)
- `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/hooks/useRenderPlanGeometries.ts` (line 20)
- `src/hooks/features/useRenderGeometries.ts` (lines 37, 58)
- And 7+ more files

**Duplicate code:**
```typescript
graphicsLayer.removeAll();
// ... create graphics ...
if (graphics.length > 0) {
  graphicsLayer.addMany(graphics);
}
```

**Recommendation:** Create utility function:
```typescript
// src/helpers/ArcGISHelpers/replaceGraphics.ts
export function replaceGraphics(
  layer: __esri.GraphicsLayer,
  graphics: __esri.Graphic[]
): void {
  layer.removeAll();
  if (graphics.length > 0) {
    layer.addMany(graphics);
  }
}
```

**Impact:** Reduce ~30 lines of duplicate code

---

## 🟡 MEDIUM PRIORITY: Performance Optimizations

### 5. **Missing React.memo on List Components**
**Components that could benefit from memoization:**
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Common/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/TemplateFlight/PointsList.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx`

**Recommendation:** Wrap with `React.memo` to prevent unnecessary re-renders

**Impact:** Improve rendering performance, especially with large lists

---

### 6. **Missing useCallback on Event Handlers**
**Files that could benefit:**
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/PointsList.tsx` - `handlePointClick`, `handlePointHover`
- `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` - `handleGeometryClick`, `handleGeometryHover`

**Recommendation:** Wrap event handlers with `useCallback`

**Impact:** Prevent unnecessary re-renders of child components

---

### 7. **Inefficient Array Operations**
**Pattern:** Using `find()` in loops instead of creating a Map

**Files:**
- `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useMapGraphics.ts` (line 72)
- `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/index.tsx` (line 215)

**Current code:**
```typescript
pointsTable.forEach((point) => {
  const alreadyStarred = starredPoints.find((p) => p.id === point.id);
  // ...
});
```

**Recommendation:** Create a Set or Map for O(1) lookup:
```typescript
const starredPointsSet = new Set(starredPoints.map(p => p.id));
pointsTable.forEach((point) => {
  const alreadyStarred = starredPointsSet.has(point.id);
  // ...
});
```

**Impact:** Improve performance with large datasets (O(n²) → O(n))

---

## 🟢 LOW PRIORITY: Code Organization

### 8. **Unused Imports**
**Recommendation:** Run ESLint with `--fix` to automatically remove unused imports

**Command:**
```bash
npm run lint -- --fix
```

---

### 9. **Empty Folders**
**Folders to check:**
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Steps/` - Verify if empty

**Recommendation:** Remove empty folders

---

### 10. **Deep Import Paths**
**Files with deep relative imports:**
- `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Step3/index.tsx` - `../../../../../../../hooks/zustand/useAddPointStates`
- `src/Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/Steps/Step3/Buttons.tsx` - `../../../../../../../../hooks/zustand/useEnrichedPointState`

**Recommendation:** Use path aliases (already configured in tsconfig.json):
```typescript
// Instead of: ../../../../../../../hooks/zustand/useAddPointStates
// Use: @hooks/zustand/useAddPointStates
```

**Impact:** Improve readability, reduce errors from path changes

---

## 📊 Summary Statistics

- **Duplicate yellow marker symbol:** 4+ files (~40 lines)
- **Duplicate starred point symbol:** 3+ files (~20 lines)
- **MapView validation pattern:** 15+ files (~30 lines)
- **removeAll + addMany pattern:** 10+ files (~30 lines)
- **Total duplicate code:** ~120+ lines
- **Performance optimizations:** 7+ components could benefit from memoization
- **Inefficient operations:** 2+ files with O(n²) complexity

---

## ✅ Already Completed Optimizations

1. ✅ Extracted geometry rendering to `createGeometryGraphic.ts`
2. ✅ Extracted point rendering to `createPointGraphic.ts`
3. ✅ Extracted coordinate transformation to `getPointCoordinates`
4. ✅ Moved `useDrawYellowGeometries` to hooks folder
5. ✅ Extracted `useGeometryHover` to hooks folder
6. ✅ Consolidated `AddPointsVluchtPlan/Step2` and `Step3` duplicate code

---

## 🎯 Recommended Action Plan

### Phase 1: High Priority (Immediate)
1. Extract yellow marker symbol to shared constant
2. Extract starred point symbol to shared constant
3. Create `validateMapView` utility function
4. Create `replaceGraphics` utility function

### Phase 2: Medium Priority (This Week)
5. Add `React.memo` to list components
6. Add `useCallback` to event handlers
7. Optimize array operations (find → Set/Map)

### Phase 3: Low Priority (Next Sprint)
8. Run ESLint to remove unused imports
9. Remove empty folders
10. Fix deep import paths using aliases

---

**Note:** This analysis was performed without modifying code. All recommendations should be reviewed and approved before implementation.

