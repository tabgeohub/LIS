import { useTabState } from "@helpers/ZustandStates/tabState";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons() {
  const { labels } = useWizardButtons("Edit geometry");
  const { setSelectedTab } = useTabState();

  return (
    <WizardButtonBar
      className=""
      buttons={[
        { label: labels.annuleren, onClick: () => setSelectedTab("none") },
      ]}
    />
  );
}
