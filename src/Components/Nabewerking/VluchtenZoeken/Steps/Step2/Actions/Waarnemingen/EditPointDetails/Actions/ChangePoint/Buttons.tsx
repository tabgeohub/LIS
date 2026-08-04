import { useContent } from "hooks/useContent";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons({
  setAction,
  setOpenFilter,
  handleSubmit,
}: {
  setAction: (value: string) => void;
  setOpenFilter: (value: boolean) => void;
  handleSubmit: () => void;
}) {
  const { withLog, labels } = useWizardButtons("Second step - Change point");
  const content = useContent();
  const details =
    content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails;

  return (
    <WizardButtonBar
      className="flex gap-x-2 justify-end mt-2"
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog("User clicked 'Previous' button", () => setAction("form")),
        },
        {
          label: details.kaartfilter,
          onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
        },
        {
          label: labels.volgende,
          onClick: handleSubmit,
        },
      ]}
    />
  );
}
