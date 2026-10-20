import DeletePoint from "../DeletePoint";
import { FinishedPointType } from "Types/finished_plans";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { useCanEdit } from "hooks/useCanEdit";
import type { EditObservationButtonsProps } from "../../../common/editObservationFormProps";

export default function Buttons({
  setAction,
  setOpenEdit,
  handleUpdate,
}: EditObservationButtonsProps & {
  selectedPoint?: FinishedPointType;
}) {
  const { withLog, labels, content } = useWizardButtons("Second step - Form");
  const userCanEdit = useCanEdit();
  const details =
    content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails;

  return (
    <div className="mt-6 flex gap-x-1 justify-end mr-2">
      <WizardButtonBar
        className=""
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Cancel' button", () =>
              setOpenEdit(false)
            ),
          },
          {
            label: details.fotoBtn,
            onClick: withLog("User clicked 'Foto's' button", () =>
              setAction("foto")
            ),
          },
          {
            label: details.changePointBtn,
            hidden: !userCanEdit,
            onClick: withLog("User clicked 'Change point' button", () =>
              setAction("changePoint")
            ),
          },
        ]}
      />
      {userCanEdit && <DeletePoint setOpenEdit={setOpenEdit} />}
      {userCanEdit && (
        <WizardButtonBar
          className=""
          buttons={[{ label: labels.opslaan, onClick: handleUpdate }]}
        />
      )}
    </div>
  );
}
