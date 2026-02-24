import { useState, useMemo, useEffect } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SingleGeometry from "./SingleGeometry";
import ConfirmationModal from "./ConfirmationModal";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useDeleteData } from "utils/useDeleteData";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";

export default function EditGeometry() {
    const { dbGeometries, fetchGeometries, setGeometries, setDbGeometries } = useGeometriesStore();
    const { user } = useAuth();
    const { mapView, geometriesGraphicsLayer, yellowGraphicsLayer, pointsGraphicsLayer } = useMapViewState();
    const [filterTerm, setFilterTerm] = useState("");
    const [selectedGeometry, setSelectedGeometry] = useState<Geometry | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const content = useContent();
    const logAction = useLogAction();
    const { deleteData, loading } = useDeleteData(`/geometries`);

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

    const handleDeleteClick = (geometry: Geometry) => {
        setSelectedGeometry(geometry);
        setShowConfirmModal(true);

        logAction({
            message: "User clicked 'Delete' button to open confirmation modal",
            step: "Edit Geometry",
            newData: {
                geometry: geometry.omschrijving || `Geometrie ${geometry.id}`,
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
                        geometry: selectedGeometry.omschrijving || `Geometrie ${selectedGeometry.id}`,
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
                            onDeleteClick={handleDeleteClick}
                        />
                    ))}
                </div>
            </ScrollButtonsLayout>

            <ConfirmationModal
                isOpen={showConfirmModal}
                setIsOpen={setShowConfirmModal}
                selectedGeometry={selectedGeometry}
                handleDelete={handleDelete}
                loading={loading}
                isDeleting={isDeleting}
            />
        </>
    );
}

