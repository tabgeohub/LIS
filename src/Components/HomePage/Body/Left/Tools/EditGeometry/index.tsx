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
import { calculateCenterAndZoom } from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import useLogAction from "hooks/useLogAction";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import { geometryDisplayName } from "./EditForm/helpers/labels";

export default function EditGeometry() {
    const { dbGeometries, fetchGeometries, setGeometries, setDbGeometries } = useGeometriesStore();
    const { user } = useAuth();
    const { mapView, geometriesGraphicsLayer, yellowGraphicsLayer, pointsGraphicsLayer } = useMapViewState();
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

    // Hide points when entering EditGeometry tab
    useEffect(() => {
        pointsGraphicsLayer?.removeAll();
    }, [pointsGraphicsLayer]);

    // Fetch geometries on mount
    useEffect(() => {
        if (user.user_id !== undefined && user.user_id !== 0) {
            fetchGeometries({
                regio: user.role && user.role !== "admin" ? user.role : undefined,
            });
        }
    }, [user.user_id, user.role, fetchGeometries]);

    // Filter geometries based on search term
    const filteredGeometries = useMemo(() => {
        if (!filterTerm) {
            return dbGeometries;
        }
        return dbGeometries.filter((geometry) =>
            (geometry.omschrijving || `Geometrie ${geometry.id}`)
                .toLowerCase()
                .includes(filterTerm.toLowerCase())
        );
    }, [dbGeometries, filterTerm]);

    const handleEditClick = (geometry: Geometry) => {
        handleRemoveHoveredGeometry();
        addEditGeometryHighlight(geometry);
        setEditingGeometry(geometry);

        if (mapView && geometry.points?.length) {
            const points = geometry.points
                .filter(
                    (p) =>
                        typeof p.latitude === "number" &&
                        typeof p.longitude === "number" &&
                        Number.isFinite(p.latitude) &&
                        Number.isFinite(p.longitude)
                )
                .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
            if (points.length > 0) {
                const { center, zoom } = calculateCenterAndZoom(points);
                mapView.goTo({
                    target: {
                        geometry: {
                            type: "point",
                            x: center.longitude,
                            y: center.latitude,
                        },
                    },
                    zoom,
                });
            }
        }

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

    const handleEditSave = (
        draft: GeometryEditDraft,
        points?: GeometryPointRow[]
    ) => {
        if (!editingGeometry) return;

        const payload = {
            id: editingGeometry.id,
            omschrijving: draft.omschrijving,
            organisatie: draft.organisatie,
            activiteit: draft.activiteit,
            specifiek_letten_op: draft.specifiek_letten_op,
            vertrouwelijk: draft.vertrouwelijk ? 1 : 0,
            herhalen: draft.herhalen ? 1 : 0,
            points: points ?? editingGeometry.points,
        };

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

        const updatedGeometry: Geometry = {
            ...editingGeometry,
            points: allPoints,
        };

        setEditingGeometry(updatedGeometry);
        addEditGeometryHighlight(updatedGeometry);

        const updateGeometryCollection = (geometries: Geometry[]) =>
            geometries.map((g) =>
                g.id === updatedGeometry.id
                    ? {
                          ...g,
                          points: g.points.map((p) =>
                              p.id === updatedPoint.id ? { ...p, ...updatedPoint } : p
                          ),
                      }
                    : g
            );

        setGeometries(updateGeometryCollection(dbGeometries));
        setDbGeometries(updateGeometryCollection(dbGeometries));
    };

    const handleDeleteClick = (geometry: Geometry) => {
        setSelectedGeometry(geometry);
        setShowConfirmModal(true);

        logAction({
            message: "User clicked 'Delete' button to open confirmation modal",
            step: "Edit Geometry",
            newData: {
                geometry: geometryDisplayName(geometry),
            },
        });
    };

    const handleDelete = async () => {
        if (!selectedGeometry) return;

        setIsDeleting(true);

        try {
            await deleteData(selectedGeometry.id, undefined, () => {
                // Update geometries list by removing deleted geometry
                const updatedGeometries = dbGeometries.filter(
                    (g) => g.id !== selectedGeometry.id
                );
                setGeometries(updatedGeometries);
                setDbGeometries(updatedGeometries);

                // Clear graphics
                geometriesGraphicsLayer?.removeAll();
                yellowGraphicsLayer?.graphics.removeAll();
                mapView?.graphics.removeAll();

                // Close modal and reset state
                setShowConfirmModal(false);
                setSelectedGeometry(null);

                logAction({
                    message: "User deleted a geometry",
                    step: "Edit Geometry",
                    newData: {
                        geometry: geometryDisplayName(selectedGeometry),
                    },
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

