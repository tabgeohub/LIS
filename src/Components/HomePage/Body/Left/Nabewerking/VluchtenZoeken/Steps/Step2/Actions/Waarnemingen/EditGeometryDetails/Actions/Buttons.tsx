import { useContent } from "hooks/useContent";
import { FinishedGeometryType } from "Types/finished_plans";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import type { EditObservationButtonsProps } from "../../common/editObservationFormProps";

export default function Buttons({
  setAction,
  setOpenEdit,
  handleUpdate,
}: EditObservationButtonsProps & {
  selectedGeometry?: FinishedGeometryType;
}) {
  const { withLog, labels } = useWizardButtons("Second step - Edit geometry");
  const content = useContent();
  const fotoLabel =
    content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails.fotoBtn;

  return (
    <WizardButtonBar
      className="mt-6 flex gap-x-1 justify-end mr-2"
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog("User clicked 'Cancel' button", () => setOpenEdit(false)),
        },
        {
          label: fotoLabel,
          onClick: withLog("User clicked 'Foto's' button", () => setAction("foto")),
        },
        {
          label: labels.opslaan,
          onClick: handleUpdate,
        },
      ]}
    />
  );
}
