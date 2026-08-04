import { PlanInformationPanel } from "Components/Common/PlanInformationPanel";
import type { PlanInformationProps } from "Components/HomePage/Body/Left/Common/planInformationProps";
import Images from "./Images";

export default function PlanInformation(props: PlanInformationProps) {
  return (
    <PlanInformationPanel {...props} layout="scroll">
      <Images selectedPlan={props.selectedPlan} />
    </PlanInformationPanel>
  );
}
