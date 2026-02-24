import { useOpenTable } from "@helpers/ZustandStates/showTable";
import toast from "react-hot-toast";
import { useViewPlanState } from "../../helpers/useViewPlanState";
import { usePlanDuplicateState } from "../../helpers/usePlanDuplicateState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons({
  handleCancel,
  setVluchtnummer,
}: {
  handleCancel: () => void;
  setVluchtnummer: (vluchtnummer: string) => void;
}) {
  const logAction = useLogAction();

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

      logAction({
        message: "User tried to open a flight plan that is already in progress",
        step: "View plan",
      });
    } else {
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

      logAction({
        message: "User clicked 'Next' button to open a flight plan",
        step: "View plan",
      });
    }
  };

  const duplicateFlightPlan = () => {
    if (selectedPlan) {
      const date = selectedPlan.datum.split("T")[0];

      setDuplicatedFlightPlan({ ...selectedPlan, datum: date });

      setStep(5);

      logAction({
        message: "User clicked 'Duplicate' button",
        step: "View plan",
      });
    }
  };

  return (
    <>
      <button
        className="gray-button"
        onClick={duplicateFlightPlan}
        disabled={selectedPlan?.status !== "pre-prepared"}
      >
        Duplicate
      </button>

      <button className="gray-button" onClick={() => setOpenFilter(true)}>
        Filteren
      </button>

      <button
        disabled={
          !selectedPlan ||
          selectedPlan.status === "finished" ||
          selectedPlan.status === "in-progress" ||
          selectedPlan.status === "canceled"
        }
        className="gray-button"
        onClick={submitStep1}
      >
        Volgende
      </button>

      <button
        className="gray-button"
        onClick={() => {
          handleCancel();

          logAction({
            message: "User clicked 'Cancel' button",
            step: "View plan",
          });
        }}
      >
        Annuleren
      </button>
    </>
  );
}
