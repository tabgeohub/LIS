import { useDeleteData } from "api-hooks/mutations";
import { useUpdateData } from "api-hooks/mutations";

export function useEditGeometryMutations(editingGeometryId: number) {
  const { deleteData, loading: isDeletingGeometry } = useDeleteData(`/geometries`);
  const { update: updateGeometry, loading: isUpdatingGeometry } = useUpdateData(
    `/geometries/${editingGeometryId}`
  );
  return { deleteData, isDeletingGeometry, updateGeometry, isUpdatingGeometry };
}
