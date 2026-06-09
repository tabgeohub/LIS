import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";
import { useCreateData } from "utils/useCreateData";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

export default function Buttons({
  handleCancel,
  refetch,
}: {
  handleCancel: () => void;
  refetch: () => void;
}) {
  const { setStep, setSelectedIndex } = useViewPlanState();
  const { selectedBasemap } = useSelectedBasemapState();
  const {
    duplicatedFlightPlan,
    vluchtnummer,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
  } = usePlanDuplicateState();
  const { setPointsTable, setGeometriesTable, setOpenTable } = useOpenTable();
  const { create } = useCreateData("/flightPlans");
  const { user } = useAuth();
  const { selectedLayers } = kaartlagenState();
  const { labels } = useWizardButtons("View plan - Duplicate Step 2");

  const submitStep2 = () => {
    const attributes = {
      vluchtnummer,
      omschrijving,
      waarnemer,
      piloot,
      datum,
      vliegduur: geplandeVliegduur,
      luchtvaartuig: typeLuchtvaartuig,
      passagiers: aantalPassagiers,
      hoofdthema: doelEnHoofdthema,
      aanvullende: aanvullendeInfo,
      points: duplicatedFlightPlan?.points.flatMap((point) => point.id),
      regio_id: user.role,
      basemap: selectedBasemap,
      layers: selectedLayers.join(","),
      user_id: user?.user_id,
      status: "pre-prepared",
    };

    create(attributes, () => {
      refetch();
      setStep(1);
    });
  };

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.vorige,
          onClick: () =>
            runWizardCleanup([
              () => setStep(1),
              () => setSelectedIndex(0),
              () => setPointsTable([]),
              () => setGeometriesTable([]),
              () => setOpenTable(false),
            ]),
        },
        {
          label: labels.opslaan,
          onClick: submitStep2,
        },
        {
          label: labels.annuleren,
          onClick: handleCancel,
        },
      ]}
    />
  );
}
