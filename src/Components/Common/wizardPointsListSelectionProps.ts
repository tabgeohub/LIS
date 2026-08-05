import type { EnrichedPointType } from "Types";

/** Shared selection props for WizardPointsList wrappers. */
export type WizardPointsListSelectionProps = {
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  points: EnrichedPointType[];
};
