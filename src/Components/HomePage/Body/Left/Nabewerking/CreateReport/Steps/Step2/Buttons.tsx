import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleStep2 } from "../../helpers/useHandleStep2";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useLogAction from "hooks/useLogAction";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";

export default function Step2Buttons() {
    const logAction = useLogAction();
    const activities = useGetActiviteiten();
    const organizations = useGetOrganisaties();

    const { graphicsLayerHover, graphicsLayer, geometriesGraphicsLayer } =
        useMapViewState();
    const { setHoveredPoints } = useHoveredPlanState();
    const { resetFeatures } = useResetFeatures();
    const handleCancel = useHandleCancel();

    const {
        selectedPlan,
        selectedPoints,
        selectedGeometries,
        setSelectedPoints,
        setSelectedGeometries,
        setZipFile,
        setZippingStatus,
        setStep,
        setSelectedPlan,
        setFilteredPlans,
        setFilterTerm,
        clear,
    } = useCreateReportState();

    const handleStep2 = useHandleStep2(
        selectedPlan!,
        selectedPoints!,
        selectedGeometries!,
        setZipFile,
        setZippingStatus,
        activities,
        organizations
    );

    const content = useContent();

    function handlePrevious() {
        // Clear all graphics layers first
        graphicsLayerHover?.removeAll();
        graphicsLayer?.removeAll();
        setHoveredPoints(null);

        // Clear geometries layer first to remove plan geometries, then reset features to restore all geometries
        geometriesGraphicsLayer?.removeAll();
        resetFeatures();

        // Reset selected points and geometries
        setSelectedPoints([]);
        setSelectedGeometries([]);

        // Reset all fields in useCreateReportState
        setZipFile(null);
        setZippingStatus("");
        setFilteredPlans([]);
        setFilterTerm("");

        // Call clear to reset other fields (step, selectedPlan, etc.)
        clear();

        // Navigate back to step 1 (clear() already sets step to 1, but being explicit)
        setStep(1);

        logAction({
            message: "User clicked 'Previous' button",
            step: "Second step",
        });
    }

    function handleNext() {
        graphicsLayerHover?.removeAll();
        graphicsLayer?.removeAll();
        setHoveredPoints(null);
        setStep(3);
        handleStep2();

        logAction({
            message: "User clicked 'Next' button",
            step: "Second step",
        });
    }

    function handleCancelClick() {
        // Clear all graphics layers
        graphicsLayerHover?.removeAll();
        graphicsLayer?.removeAll();
        setHoveredPoints(null);

        // Clear geometries layer first to remove plan geometries, then reset features to restore all geometries
        geometriesGraphicsLayer?.removeAll();
        resetFeatures();

        // Reset selected points and geometries
        setSelectedPoints([]);
        setSelectedGeometries([]);

        // Reset all fields in useCreateReportState
        setZipFile(null);
        setZippingStatus("");
        setFilteredPlans([]);
        setFilterTerm("");

        // Call clear to reset other fields
        clear();
        handleCancel();

        logAction({
            message: "User clicked 'Cancel' button",
            step: "Second step",
        });
    }

    return (
        <>
            <button className="gray-button" onClick={handlePrevious}>
                {content.common.vorige}
            </button>

            <button onClick={handleNext} className="gray-button">
                {content.common.volgende}
            </button>

            <button className="gray-button" onClick={handleCancelClick}>
                {content.common.annuleren}
            </button>
        </>
    );
}

