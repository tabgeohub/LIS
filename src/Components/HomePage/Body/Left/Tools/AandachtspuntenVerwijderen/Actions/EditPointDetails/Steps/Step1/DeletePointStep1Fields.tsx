import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import { deletePointStep1FieldProps } from "./deletePointStep1FieldProps";
import { deletePointStep1Slots } from "./deletePointStep1Slots";
import type { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

type Model = ReturnType<typeof useDeletePointStep1FormModel>;

export function DeletePointStep1Fields(m: Model) {
  return (
    <AandachtspuntDetailsFields
      {...deletePointStep1FieldProps(m)}
      {...deletePointStep1Slots(m)}
    />
  );
}
