import { useDeleteData } from "utils/useDeleteData";
import { useUpdateData } from "utils/useUpdateData";

export function useEditGeometryMutations(editingGeometryId: number) {
  const { deleteData, loading: isDeletingGeometry } = useDeleteData(`/geometries`);
  const { update: updateGeometry, loading: isUpdatingGeometry } = useUpdateData(
    `/geometries/${editingGeometryId}`
  );
  return { deleteData, isDeletingGeometry, updateGeometry, isUpdatingGeometry };
}
