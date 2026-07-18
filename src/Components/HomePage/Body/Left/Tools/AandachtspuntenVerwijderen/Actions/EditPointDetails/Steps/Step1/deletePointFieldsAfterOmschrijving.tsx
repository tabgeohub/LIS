import { ReadOnlyPointFields } from "./ReadOnlyPointFields";
import type { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

type Model = ReturnType<typeof useDeletePointStep1FormModel>;

export function deletePointFieldsAfterOmschrijving(m: Model) {
  return (
    <ReadOnlyPointFields
      values={{
        createdAt: m.selectedPoint?.created_at!,
        userId: m.user_id,
        regioId: m.regio_id,
      }}
      labels={m.labels}
    />
  );
}
