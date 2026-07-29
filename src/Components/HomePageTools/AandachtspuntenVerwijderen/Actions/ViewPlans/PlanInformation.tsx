import { PlanInformationPanel } from "Components/HomePage/Body/Left/Common/PlanInformationPanel";
import type { PlanInformationProps } from "Components/HomePage/Body/Left/Common/planInformationProps";

export default function PlanInformation(props: PlanInformationProps) {
  return <PlanInformationPanel {...props} layout="plain" />;
}
