import { DeletePointStep1Fields } from "./DeletePointStep1Fields";
import { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

export default function Form() {
  const model = useDeletePointStep1FormModel();
  return <DeletePointStep1Fields {...model} />;
}
