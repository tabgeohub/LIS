import { buildDeletePointStep2Sub1Handlers } from "./buildDeletePointStep2Sub1Handlers";
import { useDeletePointStep2Sub1Wire } from "./useDeletePointStep2Sub1Wire";
import type { EditPointMapStepProps } from "Components/Common/EditPoint/EditPointMapStepProps";

export function useDeletePointStep2Sub1(props: EditPointMapStepProps) {
  const { logAction, content, labels } = useDeletePointStep2Sub1Wire(props);
  return {
    instructionText: labels.text1,
    saveLabel: content.common.opslaan,
    enterCoordinatesLabel: labels.coördinatenInvoeren,
    cancelLabel: content.common.annuleren,
    loadingText: labels.loading,
    isLoading: props.isLoading,
    ...buildDeletePointStep2Sub1Handlers({ props, logAction }),
  };
}
