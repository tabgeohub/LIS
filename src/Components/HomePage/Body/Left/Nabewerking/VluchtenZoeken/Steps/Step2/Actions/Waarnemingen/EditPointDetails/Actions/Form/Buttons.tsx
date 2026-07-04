import DeletePoint from "../DeletePoint";
import { FinishedPointType } from "Types/finished_plans";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons({
  setAction,
  setOpenEdit,
  handleUpdate,
}: {
  setAction: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
  handleUpdate: () => void;
  selectedPoint?: FinishedPointType;
}) {
  const { withLog, labels, content } = useWizardButtons("Second step - Form");
  const details =
    content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails;

  return (
    <div className="mt-6 flex gap-x-1 justify-end mr-2">
      <WizardButtonBar
        className=""
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Cancel' button", () => setOpenEdit(false)),
          },
          {
            label: details.fotoBtn,
            onClick: withLog("User clicked 'Foto's' button", () => setAction("foto")),
          },
          {
            label: details.changePointBtn,
            onClick: withLog("User clicked 'Change point' button", () =>
              setAction("changePoint")
            ),
          },
        ]}
      />
      <DeletePoint setOpenEdit={setOpenEdit} />
      <WizardButtonBar
        className=""
        buttons={[{ label: labels.opslaan, onClick: handleUpdate }]}
      />
    </div>
  );
}
