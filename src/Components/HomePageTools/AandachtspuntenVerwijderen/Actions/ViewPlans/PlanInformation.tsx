import { PlanInformationPanel } from "Components/Common/PlanInformationPanel";
import type { PlanInformationProps } from "Components/Common/planInformationProps";

export default function PlanInformation(props: PlanInformationProps) {
  return <PlanInformationPanel {...props} layout="plain" />;
}
