import { useOpenTable } from "@helpers/ZustandStates/showTable";
import toast from "react-hot-toast";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { usePlanDuplicateState } from "../../helpers/usePlanDuplicateState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons({
  handleCancel,
  setVluchtnummer,
}: {
  handleCancel: () => void;
  setVluchtnummer: (vluchtnummer: string) => void;
}) {
  const { logStep, withLog, labels } = useWizardButtons("View plan");
  const {
    setOpenFilter,
    selectedPlan,
    setStep,
    setOmschrijving,
    setWaarnemer,
    setPiloot,
    setDatum,
    setGeplandeVliegduur,
    setTypeLuchtvaartuig,
    setAantalPassagiers,
    setDoelEnHoofdthema,
    setAanvullendeInfo,
  } = useViewPlanState();
  const { setDuplicatedFlightPlan } = usePlanDuplicateState();
  const { setPointsTable, setGeometriesTable, setView } = useOpenTable();
  const content = useContent();

  const submitStep1 = () => {
    if (selectedPlan?.status === "in-progress") {
      toast.error(
        content.voorbereiding.vluchtplanInformatie.step1.alreadyInProgressToast
      );
      logStep("User tried to open a flight plan that is already in progress");
      return;
    }

    if (selectedPlan) {
      const date = selectedPlan.datum.split("T")[0];
      setStep(2);
      setVluchtnummer(selectedPlan.vluchtnummer);
      setOmschrijving(selectedPlan.omschrijving);
      setWaarnemer(selectedPlan.waarnemer);
      setPiloot(selectedPlan.piloot);
      setDatum(date);
      setGeplandeVliegduur(selectedPlan.vliegduur);
      setTypeLuchtvaartuig(selectedPlan.luchtvaartuig);
      setAantalPassagiers(Number(selectedPlan.passagiers));
      setDoelEnHoofdthema(selectedPlan.hoofdthema);
      setAanvullendeInfo(selectedPlan.aanvullende);
      setPointsTable(selectedPlan.points);
      setGeometriesTable(selectedPlan.geometries || []);
      setView("points");
    }

    logStep("User clicked 'Next' button to open a flight plan");
  };

  const duplicateFlightPlan = () => {
    if (!selectedPlan) return;
    const date = selectedPlan.datum.split("T")[0];
    setDuplicatedFlightPlan({ ...selectedPlan, datum: date });
    setStep(5);
    logStep("User clicked 'Duplicate' button");
  };

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: "Duplicate",
          onClick: duplicateFlightPlan,
          disabled: selectedPlan?.status !== "pre-prepared",
        },
        {
          label: labels.filteren,
          onClick: () => setOpenFilter(true),
        },
        {
          label: labels.volgende,
          onClick: submitStep1,
          disabled:
            !selectedPlan ||
            selectedPlan.status === "finished" ||
            selectedPlan.status === "in-progress" ||
            selectedPlan.status === "canceled",
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", handleCancel),
        },
      ]}
    />
  );
}
