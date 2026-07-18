type Unit = "kilometers" | "meters";

export type PointListBufferFormInput = {
  distance: number;
  setDistance: (value: number) => void;
  unit: Unit;
  setUnit: (value: Unit) => void;
  saveToSketch: boolean;
  setSaveToSketch: (value: boolean) => void;
  onClear: () => void;
  onCancel: () => void;
  onBuffer: () => void;
};
