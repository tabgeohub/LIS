# NEXT-FOCUS-STATUS — Architecture Recovery executed

## Baseline (20260730 export)

Architecture **3.88** (UI ~3.8) despite adjacency ↑ and coupling ↑ — HomePage mega-component + Knowledge crash.

## Executed recovery (this session)

### P1 — Shrink external module surface
- Added `hooks/zustand/ui/index.ts` barrel; retargeted **248** deep UI-store imports → `hooks/zustand/ui`
- HomePage mutation imports: `utils/use*Data` → `api-hooks/mutations` (**45** files)
- Deep api-hooks paths → package barrels (**4** files)
- Added `hooks/features/index.ts`; retargeted store imports (**113** files)

### P2 — ArcGISHelpers revert
- Moved Wave-4 ArcGISHelpers cluster **back** to `src/helpers/ArcGISHelpers` (77 files)
- Retargeted **69** import sites; HomePage no longer owns the ArcGIS helper tree

### P3 — Hooks without growing HomePage
- Features/ui barrels only (no further HomePage colocation)

### P4 — Controlled HomePage split
- `Body/Left/Voorbereiding` → `Components/Voorbereiding`
- `Body/Left/Nabewerking` → `Components/Nabewerking`
- `Body/Left/Tools` → `Components/HomePageTools`
- Fixed relative escapes + false `Common/` rewrites

### Verified
- No `TS2307` / missing exports
- Vitest: **15 files / 39 tests passed**

## Your action

1. Commit + deploy
2. **Rescan** in Sigrid
3. Export Architecture **summary + adjacency + coupling** again

## Success criteria

| Metric | Target |
| --- | --- |
| Architecture | ≥ **4.0** |
| HomePage LOC weight | Much lower (features extracted) |
| Data coupling | stay ~**3.5** |
