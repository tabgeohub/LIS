import { useTabState } from "@helpers/ZustandStates/tabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

export default function Buttons() {
  const { withLog, labels } = useWizardButtons("Remove flight plan");
  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover } = useMapViewState();
  const { setOpenFilter, setOpenDeleteModal, selectedPlan } = useDeleteFlightPlan();

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.filteren,
          onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
        },
        {
          label: labels.volgende,
          onClick: withLog("User clicked 'Next' button", () => setOpenDeleteModal(true)),
          disabled: !selectedPlan,
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () => {
            setSelectedTab("none");
            graphicsLayer?.removeAll();
            graphicsLayerHover?.removeAll();
          }),
        },
      ]}
    />
  );
}
