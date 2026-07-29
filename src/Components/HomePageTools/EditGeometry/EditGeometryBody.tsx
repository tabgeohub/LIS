import ConfirmationModal from "./ConfirmationModal";
import EditForm from "./EditForm";
import { EditGeometryListView } from "./EditGeometryListView";
import type { useEditGeometryHandlers } from "./useEditGeometryHandlers";
import type { useEditGeometryModel } from "./useEditGeometryModel";

type Model = ReturnType<typeof useEditGeometryModel>;
type Handlers = ReturnType<typeof useEditGeometryHandlers>;

export function EditGeometryFormPanel({
  m,
  h,
}: {
  m: Model;
  h: Handlers;
}) {
  if (!m.editingGeometry) return null;
  return (
    <EditForm
      geometry={m.editingGeometry}
      onCancel={() => {
        m.highlight.removeEditGeometryHighlight();
        m.setEditingGeometry(null);
      }}
      onSave={h.handleEditSave}
      onPointUpdated={h.handlePointUpdated}
      isSavingMetadata={m.isUpdatingGeometry}
    />
  );
}

export function EditGeometryConfirmModal({
  m,
  h,
}: {
  m: Model;
  h: Handlers;
}) {
  return (
    <ConfirmationModal
      isOpen={m.showConfirmModal}
      setIsOpen={m.setShowConfirmModal}
      selectedGeometry={m.selectedGeometry}
      handleDelete={h.handleDelete}
      loading={m.isDeletingGeometry}
      isDeleting={m.isDeleting}
    />
  );
}

export function EditGeometryBody({ m, h }: { m: Model; h: Handlers }) {
  return (
    <>
      {m.editingGeometry ? (
        <EditGeometryFormPanel m={m} h={h} />
      ) : (
        <EditGeometryListView
          filterTermSetter={m.setFilterTerm}
          dbGeometries={m.dbGeometries}
          filteredGeometries={m.filteredGeometries}
          onEditClick={h.handleEditClick}
          onDeleteClick={h.handleDeleteClick}
        />
      )}
      <EditGeometryConfirmModal m={m} h={h} />
    </>
  );
}
