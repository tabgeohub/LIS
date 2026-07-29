import { buildHerhalenSelection } from "@helpers/points/herhalenSelection";

type HerhalenItem = {
  id: number;
  herhalen?: number | string | boolean | null;
};

export type HerhalenSelectionSetters = {
  setSelectedPoints: (ids: number[]) => void;
  setSelectedPoints2: (ids: number[]) => void;
  setSelectedGeometries: (ids: number[]) => void;
  setSelectedGeometries2?: (ids: number[]) => void;
};

export function selectAllByHerhalen(input: {
  points: HerhalenItem[];
  geometries: HerhalenItem[];
  herhalen: boolean;
  setters: HerhalenSelectionSetters;
}) {
  const selection = buildHerhalenSelection(input);
  if (input.herhalen) {
    input.setters.setSelectedPoints(selection.pointIds);
    input.setters.setSelectedGeometries(selection.geometryIds);
  } else {
    input.setters.setSelectedPoints2(selection.pointIds);
    (input.setters.setSelectedGeometries2 ??
      input.setters.setSelectedGeometries)(selection.geometryIds);
  }
}

export function clearHerhalenSelection(setters: HerhalenSelectionSetters) {
  setters.setSelectedPoints([]);
  setters.setSelectedPoints2([]);
  setters.setSelectedGeometries([]);
  setters.setSelectedGeometries2?.([]);
}

/** Non-hook handlers for herhalen select-all / select-none. */
export function createHerhalenSelectionHandlers(input: {
  points: HerhalenItem[];
  geometries: HerhalenItem[];
  herhalen: boolean;
  setters: HerhalenSelectionSetters;
}) {
  return {
    handleSelectAll: () => selectAllByHerhalen(input),
    handleSelectNone: () => clearHerhalenSelection(input.setters),
  };
}
