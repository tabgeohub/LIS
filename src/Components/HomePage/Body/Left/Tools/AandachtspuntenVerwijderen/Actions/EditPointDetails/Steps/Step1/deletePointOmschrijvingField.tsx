import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import type { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

type Model = ReturnType<typeof useDeletePointStep1FormModel>;

export function deletePointOmschrijvingField(m: Model) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-start">
      <TextAreaComp
        value={m.omschrijving}
        setValue={m.setOmschrijving}
        label={m.labels.omschrijving}
      />
    </div>
  );
}
