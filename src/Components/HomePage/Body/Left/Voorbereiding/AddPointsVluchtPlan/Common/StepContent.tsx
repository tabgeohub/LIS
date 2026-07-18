import { useStepContentHooks } from "./useStepContentHooks";
import { StepContentView } from "./StepContentView";

interface StepContentProps {
  herhalen: boolean;
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  filteredPoints: any[];
  setFilteredPoints: (value: any[]) => void;
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
  selectedPlan: any;
  buttons: React.ReactNode;
}

export default function StepContent(props: StepContentProps) {
  const model = useStepContentHooks(props);
  return <StepContentView {...props} {...model} />;
}
