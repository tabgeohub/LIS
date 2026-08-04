import { useDeletePointState } from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import Loading from "./Loading";
import { pickPointCoreLogData } from "Components/HomePage/helpers/points/buildPointUpdatePayload";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/Common/Wizard/wizardButtonBarClass";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { useDeletePointDetailsSubmit } from "../../useDeletePointDetailsSubmit";

export default function Buttons({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const { withLog, logStep, labels, content } = useWizardButtons(
    "Edit point details - Step 1"
  );
  const { setMainStep, clear } = useDeletePointState();
  const { handleSubmit: submitDetails, loading, selectedPoint } =
    useDeletePointDetailsSubmit(() => setMainStep("main"), {
      includeYellowGraphicsLayer: true,
    });

  function handleSubmit() {
    submitDetails();
    if (selectedPoint) {
      logStep("User clicked 'Save' button", pickPointCoreLogData(selectedPoint));
    }
  }

  const geometrieLabel =
    content.tools.aandachtspuntenVerwijderen.editPoint.geometrieAanpassen;

  return (
    <>
      <WizardButtonBar
        className={WIZARD_BUTTON_BAR_CLASS}
        buttons={[
          {
            label: content.common.verwijderen,
            onClick: withLog("User clicked 'Back' button", () => {
              clear();
              setMainStep("main");
            }),
          },
          {
            label: geometrieLabel,
            onClick: withLog("User clicked 'Edit geometry' button", () => setStep(2)),
          },
          { label: labels.opslaan, onClick: handleSubmit },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () => setMainStep("main")),
          },
        ]}
      />
      {loading && <Loading />}
    </>
  );
}
