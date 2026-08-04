export type EditPointMapStepProps = {
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  subStep: number;
  isLoading: boolean;
  handleSubmit: () => void;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
};
