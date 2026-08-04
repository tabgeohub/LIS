import { useFormikContext } from "formik";
import useLogAction from "hooks/useLogAction";
import { useState } from "react";
import type { EditPointMapStepProps } from "Components/Common/EditPoint/EditPointMapStepProps";
import { buildEditPointStep2Sub1Handlers } from "./buildEditPointStep2Sub1Handlers";
import { useEditPointFormMapClick } from "./useEditPointFormMapClick";
import type { EditPointFormValues } from "./editPointFormValues";
import { editPointStep2Sub1Labels } from "./editPointStep2Sub1Labels";

export function useEditPointStep2Sub1(props: EditPointMapStepProps) {
  const logAction = useLogAction();
  const { values, setValues } = useFormikContext<EditPointFormValues>();
  const [mapClickedNotify, setMapClickedNotify] = useState(0);

  useEditPointFormMapClick({
    subStep: props.subStep,
    mapClickedNotify,
    setMapClickedNotify,
    setCurrentPoint: props.setCurrentPoint,
    setValues,
    values,
  });

  return {
    ...editPointStep2Sub1Labels,
    isLoading: props.isLoading,
    ...buildEditPointStep2Sub1Handlers({ props, logAction }),
  };
}
