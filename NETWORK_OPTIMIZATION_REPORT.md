# Network Optimization Report - Heavy & Unnecessary API Calls

This report identifies places where network requests are made heavily and unnecessarily, specifically for flightplans, points, and geometries.

## 🔴 CRITICAL ISSUES - Duplicate API Calls

### 1. **Duplicate Points API Calls** (HIGH PRIORITY)
**Location**: `src/hooks/features/useRenderPoints.ts` (lines 17-27)

**Problem**: Both `fetchPoints` and `fetchDBPoints` are called with **identical parameters** and both hit the same endpoint `/api/points?hasGeometry=false` with the same filters.

```typescript
useEffect(() => {
  if (user.user_id === undefined || user.user_id === 0) return;

  fetchPoints({ regio: user.role });      // API call #1
  fetchDBPoints({ regio: user.role });     // API call #2 - DUPLICATE!
}, [user]);
```

**Impact**: 
- **2x unnecessary API calls** every time the user object changes
- Both functions in `usePointsStore.ts` (lines 55-81 and 83-109) make identical requests
- Wastes bandwidth and increases server load

**Recommendation**: 
- Remove one of these calls (likely `fetchDBPoints` if `fetchPoints` is sufficient)
- OR merge them into a single function that fetches once and populates both stores if needed

---

### 2. **Duplicate Geometries API Calls** (HIGH PRIORITY)
**Location**: `src/hooks/features/useRenderGeometries.ts` (lines 19-30)

**Problem**: Both `fetchGeometries` and `fetchDBGeometries` are called with **identical parameters** and both hit the same endpoint `/api/geometries` with the same filters.

```typescript
useEffect(() => {
  if (user.user_id === undefined || user.user_id === 0) return;

  fetchGeometries({ regio: user.role && user.role !== "admin" ? user.role : undefined });      // API call #1
  fetchDBGeometries({ regio: user.role && user.role !== "admin" ? user.role : undefined });   // API call #2 - DUPLICATE!
}, [user]);
```

**Impact**: 
- **2x unnecessary API calls** every time the user object changes
- Both functions in `useGeometriesStore.ts` (lines 51-69 and 71-89) make identical requests
- Wastes bandwidth and increases server load

**Recommendation**: 
- Remove one of these calls (likely `fetchDBGeometries` if `fetchGeometries` is sufficient)
- OR merge them into a single function that fetches once and populates both stores if needed

---

### 3. **Multiple FlightPlans Fetches with Same Query** (MEDIUM PRIORITY)
**Location**: Multiple components fetching the same data independently

**Problem**: Multiple components fetch flightPlans with the same query string `/flightPlans?regio_id=${user.role}`:

1. `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/index.tsx` (line 61-63)
2. `src/Components/HomePage/Body/Left/Voorbereiding/ReuseFlightPlan/Steps/Step1/index.tsx` (line 18-20)
3. `src/Components/HomePage/Body/Left/Voorbereiding/RemoveFlightPlan/index.tsx` (line 31-33)
4. `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/index.tsx` (line 46-48)

**Impact**: 
- Each component makes its own API call even if the data is already available
- No caching mechanism in `useReadData` hook
- If multiple components are mounted simultaneously, multiple identical requests are made

**Recommendation**: 
- Implement a shared Zustand store for flightPlans data
- Add caching to `useReadData` hook (cache by URL)
- Use React Query or SWR for automatic caching and deduplication

---

## 🟡 MEDIUM PRIORITY ISSUES

### 4. **useReadData Hook Has No Caching** (MEDIUM PRIORITY)
**Location**: `src/utils/useReadData.ts`

**Problem**: Every time `useReadData` is called with the same path, it makes a new API call. There's no caching mechanism.

```typescript
export function useReadData<T>(path: string): UseReadDataResult<T> {
  // ... no caching, always fetches
  useEffect(() => {
    if (!path || path === "") return;
    fetchData(); // Always fetches, even if data was fetched before
  }, [path]);
}
```

**Impact**: 
- Same data fetched multiple times across different components
- No request deduplication
- Wastes bandwidth and increases server load

**Recommendation**: 
- Add a simple cache Map based on path
- OR migrate to React Query which handles caching automatically
- Add request deduplication (if same request is in-flight, reuse it)

---

### 5. **useEffect Dependency on `user` Object** (MEDIUM PRIORITY)
**Location**: Multiple files using `user` as dependency

**Problem**: The `user` object from Zustand might be recreated on every render, causing unnecessary refetches.

**Files affected**:
- `src/hooks/features/useRenderPoints.ts` (line 27)
- `src/hooks/features/useRenderGeometries.ts` (line 30)
- `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` (line 62)

**Impact**: 
- If `user` object reference changes, all dependent useEffects trigger
- Causes unnecessary API calls even when user data hasn't actually changed

**Recommendation**: 
- Use specific user properties as dependencies: `[user.user_id, user.role]` instead of `[user]`
- OR use Zustand's selector to get stable references
- Add a comparison check before making API calls

---

### 6. **useFetchInitialFeatures Called Multiple Times** (MEDIUM PRIORITY)
**Location**: Multiple components call `fetchInitialFeatures` which makes 4 sequential API calls

**Files calling it**:
- `src/Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/Steps/Step3/Buttons.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step2/index.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step1.tsx`
- `src/Components/HomePage/Body/Left/Voorbereiding/SelectedPoint/DeletePoint/index.tsx`

**Problem**: `useFetchInitialFeatures` makes 4 sequential API calls:
```typescript
await fetchDBPoints({ regio: regio });      // API call #1
await fetchPoints({ regio: regio });       // API call #2 (duplicate of #1!)
await fetchDBGeometries({ regio: regio }); // API call #3
await fetchGeometries({ regio: regio });   // API call #4 (duplicate of #3!)
```

**Impact**: 
- 4 API calls every time this function is called
- 2 of them are duplicates (points and geometries)
- Called from multiple places, potentially multiple times

**Recommendation**: 
- Remove duplicate calls (only fetch once per resource type)
- Consider batching these into a single endpoint if possible
- Add caching to prevent refetching if data already exists

---

## 🟢 LOW PRIORITY ISSUES

### 7. **Search API Calls on Every Keyword Change** (LOW PRIORITY)
**Location**: `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/index.tsx` (lines 27-33)

**Problem**: API calls are made immediately when `searchKeyword` changes, without debouncing.

```typescript
const { data: flightPlansData } = useReadData<FlightPlanType[]>(
  `/flightPlans/searchedFlightplan?search=${searchKeyword}`
);

const { data: pointsData } = useReadData<EnrichedPointType[]>(
  `/points/searchedPoints/${searchKeyword}`
);
```

**Impact**: 
- API calls on every keystroke
- Can cause many unnecessary requests during typing

**Recommendation**: 
- Add debouncing (e.g., 300-500ms delay)
- Only search when keyword length >= 3 characters
- Cancel previous requests if new one is made

---

### 8. **No Request Cancellation** (LOW PRIORITY)
**Location**: Throughout the codebase

**Problem**: When components unmount or dependencies change, in-flight requests are not cancelled.

**Impact**: 
- Wasted bandwidth on responses that won't be used
- Potential race conditions (old response overwriting new data)

**Recommendation**: 
- Use AbortController to cancel requests
- Cancel requests in useEffect cleanup functions
- Check if component is still mounted before setting state

---

## 📊 Summary Statistics

### Duplicate API Calls Found:
- **Points**: 2x calls (fetchPoints + fetchDBPoints) - **100% redundant**
- **Geometries**: 2x calls (fetchGeometries + fetchDBGeometries) - **100% redundant**
- **FlightPlans**: 4+ components fetching same data independently

### Estimated Network Savings:
- **Immediate**: ~50% reduction in points/geometries API calls (removing duplicates)
- **With caching**: ~70-80% reduction in total API calls
- **With shared stores**: ~60% reduction in flightPlans API calls

---

## 🎯 Recommended Action Plan

### Phase 1 (Quick Wins - High Impact):
1. ✅ Remove duplicate `fetchDBPoints` call in `useRenderPoints.ts`
2. ✅ Remove duplicate `fetchDBGeometries` call in `useRenderGeometries.ts`
3. ✅ Fix `useFetchInitialFeatures` to only fetch once per resource type

### Phase 2 (Medium Effort - High Impact):
4. ✅ Add caching to `useReadData` hook
5. ✅ Fix `user` object dependencies to use specific properties
6. ✅ Create shared Zustand store for flightPlans data

### Phase 3 (Long Term - Best Practices):
7. ✅ Migrate to React Query or SWR for automatic caching/deduplication
8. ✅ Add debouncing to search inputs
9. ✅ Implement request cancellation with AbortController

---

## 📝 Notes

- All identified issues are in the frontend code
- Backend endpoints appear to be properly structured
- The main issues are:
  1. **Duplicate API calls** (same endpoint, same params, called twice)
  2. **No caching** (same data fetched multiple times)
  3. **No request deduplication** (multiple components fetching same data simultaneously)

