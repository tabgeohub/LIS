import EditPointMapClickStep from "Components/HomePage/Body/Common/EditPoint/EditPointMapClickStep";
import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";
import { useEditPointStep2Sub1 } from "./useEditPointStep2Sub1";

export default function Step2Sub1(props: EditPointMapStepProps) {
  return <EditPointMapClickStep {...useEditPointStep2Sub1(props)} />;
}
