import { useState } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useTabState } from "hooks/zustand/ui/tabState";
import ConfirmModal from "./ConfirmModal";
import { useChangePlanStatusState } from "Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";

export default function Buttons() {
  const { withLog, labels } = useWizardButtons("Change flight plan status");
  const { selectedPlan, setOpenFilter, setSelectedPlan } = useChangePlanStatusState();
  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover } = useMapViewState();
  const [open, setOpen] = useState(false);

  return (
    <>
      <WizardButtonBar
        className=""
        buttons={[
          {
            label: labels.filteren,
            onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
          },
          {
            label: labels.volgende,
            onClick: withLog(
              "User clicked 'Next' button to change flight plan status",
              () => setOpen(true)
            ),
            disabled: !selectedPlan,
          },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () => {
              graphicsLayer?.removeAll();
              graphicsLayerHover?.removeAll();
              setSelectedPlan(null);
              setSelectedTab("none");
            }),
          },
        ]}
      />
      <ConfirmModal open={open} setOpen={setOpen} />
    </>
  );
}
