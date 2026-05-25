/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import SinglePlan from "./Content/SinglePlan";
import Buttons from "./Content/Buttons";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Loading from "./Content/Loading";
import { usePartialFinishedPlans } from "api-hooks/finishedPlans";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFilterAndSortPlans } from "../../hooks/useFilterAndSortPlans";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Step1() {
  const [filterTerm, setFilterTerm] = useState("");

  const { user } = useAuth();

  const { data: plans, isPending: loading } = usePartialFinishedPlans(
    user.role
  );

  const { filteredPlans } = useFinishedPlansState();

  // Filter and sort plans
  useFilterAndSortPlans(plans, filterTerm);

  return (
    <div className="h-full">
      <p className="text-[12px] text-gray-700 px-1.5 pt-1">
        Selecteer een vlucht om te bekijken. Gebruik de 'Filter resultaten'
        balk om een vluchtplan te zoeken. Gebruik de 'Filteren" knop om te
        filteren op periode.
      </p>

      <ScrollButtonsLayout
        setFilterTerm={setFilterTerm}
        buttons={<Buttons />}
        className="h-[96%]"
      >
        <div className="divide-y-2">
          {loading && <Loading />}

          {filteredPlans?.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-gray-400 text-[12px]">
                Er zijn geen vluchtplannen om te bekijken.{" "}
              </p>
            </div>
          )}

          {!loading &&
            filteredPlans?.map((plan) => (
              <SinglePlan plan={plan} key={plan.id} />
            ))}
        </div>
      </ScrollButtonsLayout>
    </div>
  );
}
