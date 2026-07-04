import { useTabState } from "@helpers/ZustandStates/tabState";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons() {
  const { labels } = useWizardButtons("Toevoegen kaartlagen - Step 1");
  const { setSelectedTab } = useTabState();

  return (
    <WizardButtonBar
      className="flex justify-end gap-x-1 p-2"
      buttons={[
        { label: "Zoeken", onClick: () => {} },
        { label: labels.annuleren, onClick: () => setSelectedTab("none") },
      ]}
    />
  );
}
