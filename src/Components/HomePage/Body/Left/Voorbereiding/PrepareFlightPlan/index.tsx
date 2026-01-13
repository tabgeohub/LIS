import { useState } from "react";
import Step1 from "./Steps/Step1";
import CongfirmationModal from "./Steps/CongfirmationModal";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useUpdateData } from "utils/useUpdateData";
import { FlightPlanType } from "Types";
import { useContent } from "hooks/useContent";

export default function PrepareFlightPlan() {
  const [openModal, setOpenModal] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType | null>(null);

  const { update } = useUpdateData(`/flightPlans/updateFlightPlanStatus`);
  const content = useContent();

  function handleConfirm() {
    setOpenModal(false);
    setIsPreparing(true);

    update(
      {
        id: selectedPlan?.id,
        status: "prepared",
      },
      () => {
        setSelectedPlan(null);
        setOpenModal(false);
        setIsPreparing(false);
      }
    );
  }

  return (
    <>
      {!isPreparing && (
        <Step1
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setOpenModal={setOpenModal}
        />
      )}

      <CongfirmationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedPlan={selectedPlan}
        handleConfirm={handleConfirm}
      />

      {isPreparing && (
        <div>
          <LoadingBars />

          <p className="text-center text-[12px] mt-1.5 mx-2">
            {
              content.voorbereiding.vluchtplanVoorbereiding.confirmModal
                .loadingMessage
            }
          </p>
        </div>
      )}
    </>
  );
}
