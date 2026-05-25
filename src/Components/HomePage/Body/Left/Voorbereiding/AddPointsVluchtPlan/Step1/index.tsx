/* eslint-disable react-hooks/exhaustive-deps */
import { useUnPreparedPlans } from "api-hooks/flightPlans";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { FlightPlanType } from "Types";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Step1() {
  const { setStep, selectedPlan, setSelectedPlan, clear } = useAddPointStates();

  const { user } = useAuth();

  const { data: unPreparedPlans } = useUnPreparedPlans(user.role, user.user_id);

  const logAction = useLogAction();

  const handleCancel = useHandleCancel();

  const options = [
    { id: 0, vluchtnummer: "Selecteer een vlucht" },
    ...(unPreparedPlans?.filter(
      (plan) => !plan.vluchtnummer.toLowerCase().includes("shape")
    ) || []),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selected = options.find((opt) => opt.id === selectedId);

    // @ts-ignore
    setSelectedPlan(selected);

    logAction({
      message: `User selected ${selected?.vluchtnummer} plan`,
      step: `Step 1`,
    });
  };

  const content = useContent();

  return (
    <div className="mt-6 px-1">
      <p className="text-gray-800 text-[14px] leading-[14px]">
        {content.voorbereiding.aandachtspuntToevoegenAan.step1.header}
      </p>

      <div className="flex mt-10 gap-x-16 px-4">
        <p className="text-gray-700 text-sm">
          {" "}
          {content.voorbereiding.aandachtspuntToevoegenAan.step1.vluchtnummer}
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
                {
                  content.voorbereiding.aandachtspuntToevoegenAan.step1
                    .noOptions
                }
              </option>
            )}

            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.vluchtnummer}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          disabled={selectedPlan === null || selectedPlan.id === 0}
          onClick={() => setStep(2)}
          className="gray-button"
        >
          {content.common.volgende}
        </button>

        <button
          onClick={() => {
            handleCancel();
            clear();
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>
    </div>
  );
}
