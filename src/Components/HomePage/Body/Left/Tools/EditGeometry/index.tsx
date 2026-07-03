import { useState, useMemo, useEffect } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SingleGeometry from "./SingleGeometry";
import ConfirmationModal from "./ConfirmationModal";
import EditForm, { GeometryEditDraft, GeometryPointRow } from "./EditForm";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useDeleteData } from "utils/useDeleteData";
import { useUpdateData } from "utils/useUpdateData";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import { geometryDisplayName } from "./EditForm/helpers/labels";
import {
  buildGeometrySavePayload,
  filterGeometriesByTerm,
  patchGeometryPointInList,
  zoomMapToGeometryPoints,
} from "./editGeometryHelpers";

export default function EditGeometry() {
  const { dbGeometries, fetchGeometries, setGeometries, setDbGeometries } =
    useGeometriesStore();
  const { user } = useAuth();
  const { mapView, geometriesGraphicsLayer, yellowGraphicsLayer, pointsGraphicsLayer } =
    useMapViewState();
  const {
    handleRemoveHoveredGeometry,
    addEditGeometryHighlight,
    removeEditGeometryHighlight,
  } = useGeometryHover();
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometry, setSelectedGeometry] = useState<Geometry | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingGeometry, setEditingGeometry] = useState<Geometry | null>(null);
  const logAction = useLogAction();
  const { deleteData, loading: isDeletingGeometry } = useDeleteData(`/geometries`);
  const { update: updateGeometry, loading: isUpdatingGeometry } = useUpdateData(
    `/geometries/${editingGeometry?.id ?? 0}`
  );

  useEffect(() => {
    pointsGraphicsLayer?.removeAll();
  }, [pointsGraphicsLayer]);

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user.user_id, user.role, fetchGeometries]);

  const filteredGeometries = useMemo(
    () => filterGeometriesByTerm(dbGeometries, filterTerm),
    [dbGeometries, filterTerm]
  );

  const handleEditClick = (geometry: Geometry) => {
    handleRemoveHoveredGeometry();
    addEditGeometryHighlight(geometry);
    setEditingGeometry(geometry);
    zoomMapToGeometryPoints(mapView, geometry);
    logAction({
      message: "User opened edit geometry form",
      step: "Edit Geometry",
      newData: {
        geometryId: geometry.id,
        omschrijving: geometryDisplayName(geometry),
      },
    });
  };

  const handleEditCancel = () => {
    removeEditGeometryHighlight();
    setEditingGeometry(null);
  };

  const handleEditSave = (draft: GeometryEditDraft, points?: GeometryPointRow[]) => {
    if (!editingGeometry) return;

    const payload = buildGeometrySavePayload({ editingGeometry, draft, points });
    updateGeometry(payload, (responseData) => {
      const result = responseData?.result;
      const updatedGeometry: Geometry = {
        ...editingGeometry,
        ...payload,
        ...(result ?? {}),
        points: (result?.points ?? payload.points) as Geometry["points"],
      };

      const updatedGeometries = dbGeometries.map((g) =>
        g.id === updatedGeometry.id ? updatedGeometry : g
      );
      setGeometries(updatedGeometries);
      setDbGeometries(updatedGeometries);
      logAction({
        message: "User saved geometry form",
        step: "Edit Geometry",
        newData: {
          geometryId: updatedGeometry.id,
          omschrijving: updatedGeometry.omschrijving,
          organisatie: updatedGeometry.organisatie,
          pointsCount: updatedGeometry.points?.length,
        },
      });
      removeEditGeometryHighlight();
      setEditingGeometry(null);
    });
  };

  const handlePointUpdated = (
    updatedPoint: GeometryPointRow,
    allPoints: GeometryPointRow[]
  ) => {
    if (!editingGeometry) return;

    const updatedGeometry: Geometry = { ...editingGeometry, points: allPoints };
    setEditingGeometry(updatedGeometry);
    addEditGeometryHighlight(updatedGeometry);

    const patch = (geometries: Geometry[]) =>
      patchGeometryPointInList({
        geometries,
        geometryId: updatedGeometry.id,
        updatedPoint,
      });

    setGeometries(patch(dbGeometries));
    setDbGeometries(patch(dbGeometries));
  };

  const handleDeleteClick = (geometry: Geometry) => {
    setSelectedGeometry(geometry);
    setShowConfirmModal(true);
    logAction({
      message: "User clicked 'Delete' button to open confirmation modal",
      step: "Edit Geometry",
      newData: { geometry: geometryDisplayName(geometry) },
    });
  };

  const handleDelete = async () => {
    if (!selectedGeometry) return;
    setIsDeleting(true);

    try {
      await deleteData(selectedGeometry.id, undefined, () => {
        const updatedGeometries = dbGeometries.filter(
          (g) => g.id !== selectedGeometry.id
        );
        setGeometries(updatedGeometries);
        setDbGeometries(updatedGeometries);
        geometriesGraphicsLayer?.removeAll();
        yellowGraphicsLayer?.graphics.removeAll();
        mapView?.graphics.removeAll();
        setShowConfirmModal(false);
        setSelectedGeometry(null);
        logAction({
          message: "User deleted a geometry",
          step: "Edit Geometry",
          newData: { geometry: geometryDisplayName(selectedGeometry) },
        });
      });
    } catch (error) {
      console.error("Error deleting geometry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {editingGeometry ? (
        <EditForm
          geometry={editingGeometry}
          onCancel={handleEditCancel}
          onSave={handleEditSave}
          onPointUpdated={handlePointUpdated}
          isSavingMetadata={isUpdatingGeometry}
        />
      ) : (
        <>
          <Header setFilterTerm={setFilterTerm} />
          <ScrollButtonsLayout className="h-[75%]" buttons={<Buttons />}>
            <div className="pb-40">
              {dbGeometries?.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-center text-gray-400 text-[12px]">
                    Geen geometrieën gevonden
                  </p>
                </div>
              )}
              {filteredGeometries.map((geometry) => (
                <SingleGeometry
                  key={geometry.id}
                  geometry={geometry}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>
          </ScrollButtonsLayout>
        </>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        setIsOpen={setShowConfirmModal}
        selectedGeometry={selectedGeometry}
        handleDelete={handleDelete}
        loading={isDeletingGeometry}
        isDeleting={isDeleting}
      />
    </>
  );
}
