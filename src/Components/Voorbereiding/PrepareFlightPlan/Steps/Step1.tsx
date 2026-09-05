import { useAuth } from "hooks/zustand/ui";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { FlightPlanType } from "Types";
import { useUnPreparedPlans } from "api-hooks/flightPlans";

type PlanOption = Pick<FlightPlanType, "id" | "vluchtnummer">;

const PLACEHOLDER_OPTION: PlanOption = {
  id: 0,
  vluchtnummer: "Selecteer een vlucht",
};

export default function Step1({
  setOpenModal,
  selectedPlan,
  setSelectedPlan,
}: {
  setOpenModal: (value: boolean) => void;
  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;
}) {
  const logAction = useLogAction();
  const { user } = useAuth();
  const { data: unPreparedPlans } = useUnPreparedPlans({
    regioId: user.role,
    userId: user.user_id,
  });
  const handleCancel = useHandleCancel();
  const content = useContent();

  const options: PlanOption[] = [
    PLACEHOLDER_OPTION,
    ...(unPreparedPlans || []),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    if (selectedId === 0) {
      setSelectedPlan(null);
      return;
    }
    const selected =
      unPreparedPlans?.find((opt) => opt.id === selectedId) ?? null;
    setSelectedPlan(selected);
    logAction({
      message: `User selected ${selected?.vluchtnummer} plan`,
    });
  };

  return (
    <div className="p-2">
      <p className="text-[12px]">
        {content.voorbereiding.vluchtplanVoorbereiding.text}
      </p>

      <div className="mt-[65px]">
        <div className="flex mt-6 gap-x-20 items-center">
          <p className="text-[12px] text-gray-800">
            {content.voorbereiding.vluchtplanVoorbereiding.vluchtnummer}:
          </p>
          {unPreparedPlans && (
            <select
              className={`col-span-4 inputClass !py-1 ${
                selectedPlan === null
                  ? "text-gray-300"
                  : "text-black font-semibold"
              }`}
              value={selectedPlan?.id || 0}
              onChange={handleChange}
            >
              {options.length === 0 && (
                <option key="" disabled value="">
                  {content.voorbereiding.vluchtplanVoorbereiding.noOptions}
                </option>
              )}
              {options
                .filter(
                  (option) =>
                    !option.vluchtnummer.toLowerCase().includes("shape")
                )
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.vluchtnummer}
                  </option>
                ))}
            </select>
          )}
        </div>

        <p className="mt-4 text-[12px]">
          <span className="font-bold">
            {content.voorbereiding.vluchtplanVoorbereiding.letOp.title}
          </span>{" "}
          <span className="text-gray-700">
            {content.voorbereiding.vluchtplanVoorbereiding.letOp.text}
          </span>
        </p>

        <div className="flex justify-end mt-10 gap-x-2">
          <button
            type="button"
            onClick={() => {
              setOpenModal(true);
              logAction({ message: "User clicked 'Next' button" });
            }}
            disabled={selectedPlan === null}
            className="gray-button"
          >
            {content.common.volgende}
          </button>
          <button
            type="button"
            onClick={() => {
              handleCancel();
              setSelectedPlan(null);
              logAction({ message: "User clicked 'Cancel' button" });
            }}
            className="gray-button"
          >
            {content.common.annuleren}
          </button>
        </div>
      </div>
    </div>
  );
}
