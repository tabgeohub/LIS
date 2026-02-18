import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useDeleteData } from "utils/useDeleteData";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function Buttons() {
  const logAction = useLogAction();

  const { setMainStep, clear, selectedPoints, setSelectedPoints } =
    useDeletePointState();
  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover, yellowGraphicsLayer, mapView } =
    useMapViewState();
  const { points, setPoints } = usePointsStore();
  const { deleteData, loading } = useDeleteData(`/points`);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const content = useContent();

  async function handleDelete() {
    if (selectedPoints.length === 0) {
      return;
    }

    setIsDeleting(true);

    try {
      // Delete all selected points sequentially
      const deletedIds: number[] = [];

      for (const point of selectedPoints) {
        try {
          await deleteData(point.id, undefined, undefined, undefined);
          deletedIds.push(point.id);
        } catch (error) {
          console.error(`Error deleting point ${point.id}:`, error);
          // Continue with other points even if one fails
        }
      }

      // Update points list by removing successfully deleted points
      if (deletedIds.length > 0) {
        setPoints(points.filter((p) => !deletedIds.includes(p.id)));
      }

      // Clear selected points and graphics
      setSelectedPoints([]);
      yellowGraphicsLayer?.removeAll();
      graphicsLayer?.removeAll();
      graphicsLayerHover?.removeAll();
      mapView?.graphics.removeAll();

      // Close modal after successful deletion
      setShowConfirmModal(false);

      logAction({
        message: "User clicked 'Delete' button to delete multiple points",
        step: "Main step",
        newData: {
          deletedPoints: selectedPoints
            .filter((p) => deletedIds.includes(p.id))
            .map((p) => p.omschrijving),
          count: deletedIds.length,
        },
      });
    } catch (error) {
      console.error("Error deleting points:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancel() {
    clear();
    yellowGraphicsLayer?.removeAll();
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();

    setSelectedTab("none");

    logAction({
      message: "User clicked 'Cancel' button",
      step: "Main step",
    });
  }

  const selectedPoint = selectedPoints.length > 0 ? selectedPoints[0] : null;

  return (
    <>
      <button
        onClick={() => {
          if (selectedPoints.length > 0) {
            setShowConfirmModal(true);
            logAction({
              message: "User clicked 'Delete' button to open confirmation modal",
              step: "Main step",
            });
          }
        }}
        disabled={selectedPoints.length === 0 || isDeleting}
        className="gray-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {content.common.verwijderen}
      </button>

      <button
        onClick={() => {
          setMainStep("filter");

          logAction({
            message: "User clicked 'Filter' button",
            step: "Main step",
          });
        }}
        className="gray-button"
      >
        {content.common.kaartfilter}
      </button>

      <button onClick={handleCancel} className="gray-button">
        {content.common.annuleren}
      </button>

      <ConfirmationModal
        isOpen={showConfirmModal}
        setIsOpen={setShowConfirmModal}
        selectedPoint={selectedPoint}
        handleDelete={handleDelete}
        loading={loading}
        isDeleting={isDeleting}
        content={content}
      />
    </>
  );
}
