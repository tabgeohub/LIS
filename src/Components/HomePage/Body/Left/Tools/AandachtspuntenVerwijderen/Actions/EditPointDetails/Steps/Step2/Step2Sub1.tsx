import EditPointMapClickStep from "Components/HomePage/Body/Common/EditPoint/EditPointMapClickStep";
import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";
import { useDeletePointStep2Sub1 } from "./useDeletePointStep2Sub1";

export default function Step2Sub1(props: EditPointMapStepProps) {
  const stepProps = useDeletePointStep2Sub1(props);
  return <EditPointMapClickStep {...stepProps} />;
}
