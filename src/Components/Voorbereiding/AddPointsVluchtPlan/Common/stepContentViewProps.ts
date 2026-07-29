import type { StepContentListSelectionProps } from "./stepContentListSelectionProps";

export type StepContentViewProps = StepContentListSelectionProps & {
  herhalen: boolean;
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
  setFilteredPoints: (value: any[]) => void;
};
