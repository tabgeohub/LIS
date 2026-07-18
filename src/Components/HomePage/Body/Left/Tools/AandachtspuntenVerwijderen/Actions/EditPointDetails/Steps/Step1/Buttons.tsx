import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import Loading from "./Loading";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { pickPointCoreLogData } from "@helpers/points/buildPointUpdatePayload";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { submitDeletePointDetailsUpdate } from "../../submitDeletePointDetailsUpdate";

export default function Buttons({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const { withLog, logStep, labels, content } = useWizardButtons(
    "Edit point details - Step 1"
  );
  const { points, setPoints } = usePointsStore();
  const { mapView, redGraphicsLayer, yellowGraphicsLayer } = useMapViewState();
  const formFields = useDeletePointState(pickDeletePointFormFields);
  const { setMainStep, selectedPoint, clear } = useDeletePointState();
  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  function handleSubmit() {
    submitDeletePointDetailsUpdate({
      selectedPoint,
      formFields,
      update,
      points,
      setPoints,
      mapView,
      redGraphicsLayer,
      yellowGraphicsLayer,
      onApplied: () => setMainStep("main"),
    });

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
