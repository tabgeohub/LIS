import { useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useDeleteData } from "utils/useDeleteData";
import ConfirmationModal from "./ConfirmationModal";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons() {
  const { withLog, logStep, labels, content } = useWizardButtons("Main step");
  const { setMainStep, clear, selectedPoints, setSelectedPoints } =
    useDeletePointState();
  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover, yellowGraphicsLayer, mapView } =
    useMapViewState();
  const { points, setPoints } = usePointsStore();
  const { deleteData, loading } = useDeleteData(`/points`);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function handleDelete() {
    if (selectedPoints.length === 0) return;

    setIsDeleting(true);

    try {
      const deletedIds: number[] = [];

      for (const point of selectedPoints) {
        try {
          await deleteData({ id: point.id });
          deletedIds.push(point.id);
        } catch (error) {
          console.error(`Error deleting point ${point.id}:`, error);
        }
      }

      if (deletedIds.length > 0) {
        setPoints(points.filter((p) => !deletedIds.includes(p.id)));
      }

      setSelectedPoints([]);
      yellowGraphicsLayer?.removeAll();
      graphicsLayer?.removeAll();
      graphicsLayerHover?.removeAll();
      mapView?.graphics.removeAll();
      setShowConfirmModal(false);

      logStep("User clicked 'Delete' button to delete multiple points", {
        deletedPoints: selectedPoints
          .filter((p) => deletedIds.includes(p.id))
          .map((p) => p.omschrijving),
        count: deletedIds.length,
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
  }

  const selectedPoint = selectedPoints.length > 0 ? selectedPoints[0] : null;

  return (
    <>
      <WizardButtonBar
        className=""
        buttons={[
          {
            label: content.common.verwijderen,
            onClick: () => {
              if (selectedPoints.length === 0) return;
              setShowConfirmModal(true);
              logStep("User clicked 'Delete' button to open confirmation modal");
            },
            disabled: selectedPoints.length === 0 || isDeleting,
          },
          {
            label: content.common.kaartfilter,
            onClick: withLog("User clicked 'Filter' button", () => setMainStep("filter")),
          },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", handleCancel),
          },
        ]}
      />

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
