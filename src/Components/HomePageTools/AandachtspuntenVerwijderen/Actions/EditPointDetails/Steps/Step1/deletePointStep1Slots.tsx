import { deletePointFieldsAfterOmschrijving } from "./deletePointFieldsAfterOmschrijving";
import { deletePointOmschrijvingField } from "./deletePointOmschrijvingField";
import { deletePointTrailingFields } from "./deletePointTrailingFields";
import type { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

type Model = ReturnType<typeof useDeletePointStep1FormModel>;

export function deletePointStep1Slots(m: Model) {
  return {
    omschrijvingField: deletePointOmschrijvingField(m),
    fieldsAfterOmschrijving: deletePointFieldsAfterOmschrijving(m),
    trailingFields: deletePointTrailingFields(m),
  };
}
