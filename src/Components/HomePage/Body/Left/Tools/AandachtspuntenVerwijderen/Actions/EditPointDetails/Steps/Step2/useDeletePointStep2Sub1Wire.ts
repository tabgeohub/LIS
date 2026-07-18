import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { useDeletePointMapClick } from "./useDeletePointMapClick";
import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";

export function useDeletePointStep2Sub1Wire(props: EditPointMapStepProps) {
  const logAction = useLogAction();
  const content = useContent();
  const labels = content.tools.aandachtspuntenVerwijderen.editPoint.step2;
  const { setXCoordinaat_rd, setYCoordinaat_rd, setLatitude, setLongitude } =
    useDeletePointState();
  useDeletePointMapClick({
    subStep: props.subStep,
    currentPoint: props.currentPoint,
    setCurrentPoint: props.setCurrentPoint,
    setCoords: ({ rdX, rdY, latitude, longitude }) => {
      setXCoordinaat_rd(rdX);
      setYCoordinaat_rd(rdY);
      setLatitude(latitude);
      setLongitude(longitude);
    },
  });
  return { logAction, content, labels };
}
