import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useViewPlanAddPointsState } from "../../pickViewPlanAddPointsState";
import { submitAddPointsToPlan } from "./helpers/submitAddPointsToPlan";

export default function Buttons({
  selectedPointIds,
  selectedGeometryIds,
  update,
}: {
  selectedPointIds: number[];
  selectedGeometryIds: number[];
  update: any;
}) {
  const content = useContent();
  const viewPlan = useViewPlanAddPointsState();
  const { dbPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPointsTable, setGeometriesTable, setOpenTable } = useOpenTable();
  const logAction = useLogAction();

  function handleSubmit() {
    if (!viewPlan.selectedPlan) return;

    submitAddPointsToPlan({
      selectedPlan: viewPlan.selectedPlan,
      selectedPointIds,
      selectedGeometryIds,
      dbPoints,
      dbGeometries,
      yellowGraphicsLayer,
      update,
      setSelectedPlan: viewPlan.setSelectedPlan,
      setPointsTable,
      setGeometriesTable,
      setGeometries,
      setOpenTable,
      filteredPlans: viewPlan.filteredPlans,
      setFilteredPlans: viewPlan.setFilteredPlans,
      logAction,
      setStep: viewPlan.setStep,
    });
  }

  return (
    <WizardButtonBar
      className="flex justify-end gap-x-1 text-[12px]"
      buttons={[
        {
          label: content.common.vorige,
          onClick: () => {
            viewPlan.setStep(2);

            logAction({
              message: "User clicked 'Next' button",
              step: "Third step",
            });
          },
        },
        {
          label: content.common.opslaan,
          onClick: handleSubmit,
        },
      ]}
    />
  );
}
