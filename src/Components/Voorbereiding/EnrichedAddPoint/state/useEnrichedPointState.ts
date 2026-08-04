import { create } from "zustand";
import { createEnrichedPointActions } from "./enrichedPointStateActions";
import { initialEnrichedPointValues } from "./enrichedPointStateDefaults";
import { EnrichedPointState } from "./enrichedPointStateTypes";

export { initialEnrichedPointValues } from "./enrichedPointStateDefaults";
export type { EnrichedPointState } from "./enrichedPointStateTypes";

export const useEnrichedPointState = create<EnrichedPointState>((set) => ({
  ...initialEnrichedPointValues,
  ...createEnrichedPointActions(set),
}));
