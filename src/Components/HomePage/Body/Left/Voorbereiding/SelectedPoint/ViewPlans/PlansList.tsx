import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { FaCheckCircle } from "react-icons/fa";

import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { useState } from "react";
import { FlightPlanType } from "Types";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";

dayjs.locale("nl");

export default function PlansList({
  plans,
  selectedPlan,
  setSelectedPlan,
  setStep,
}: {
  plans: FlightPlanType[];
  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const { setMainStep } = useDeletePointState();
  const [filter, setFilter] = useState("");

  return (
    <div className="h-full">
      <ScrollButtonsLayout
        setFilterTerm={setFilter}
        buttons={
          <>
            <button
              onClick={() => {
                setStep(2);

                logAction({
                  message: "User clicked 'Next' button",
                  step: "View plans",
                });
              }}
              disabled={!selectedPlan}
              className="gray-button"
            >
              Volgende
            </button>

            <button
              onClick={() => {
                setMainStep("main");

                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "View plans",
                });
              }}
              className="gray-button"
            >
              Annuleren
            </button>
          </>
        }
      >
        <div className="divide-y-2 flex flex-col gap-y-2">
          {plans.length === 0 && (
            <p className="text-gray-500 text-sm p-2">Geen vluchtplannen</p>
          )}

          {plans
            ?.filter((plan) =>
              plan.vluchtnummer.toLowerCase().includes(filter.toLowerCase())
            )
            .map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);

                  logAction({
                    message: "User clicked a plan",
                    step: "View plans",
                  });
                }}
                className={`text-[14px] px-5 py-1 cursor-pointer transition-all relative ${
                  selectedPlan?.id === plan.id
                    ? "bg-gray-100"
                    : "hover:bg-blue-100"
                }`}
              >
                {plan.is_finished && (
                  <FaCheckCircle className="absolute top-1 right-1 text-green-500 text-lg" />
                )}
                <div className="flex gap-x-2 items-center font-medium">
                  <p>vluchtplan: </p>
                  <p>{plan.vluchtnummer}</p>
                </div>

                <div className="flex gap-x-2 items-center text-gray-500">
                  <p>datum: </p>
                  <p className="capitalize">
                    {dayjs(plan.datum).format("DD MMM YYYY")}
                  </p>
                </div>

                <div className="flex gap-x-2 items-center text-gray-500">
                  <p>aanvullendeInformatie: </p>
                  <p>{plan.aanvullende}</p>
                </div>
              </div>
            ))}
        </div>
      </ScrollButtonsLayout>
    </div>
  );
}
