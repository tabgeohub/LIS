/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SinglePlan from "./Content/SinglePlan";
import Buttons from "./Content/Buttons";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Loading from "./Content/Loading";
import { useReadData } from "utils/useReadData";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import PeriodFilter from "Components/HomePage/Body/Left/Common/PeriodFilter";
import { useFilterPlans } from "../../hooks/useFilterPlans";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Step1() {
  const [filterTerm, setFilterTerm] = useState("");
  const filterPlans = useFilterPlans();

  const { user } = useAuth();

  const { data: plans, loading } = useReadData<FinishedFlightPlanType[]>(
    `/finished_plans/getPartialFinishedFlightPlans?regio_id=${user.role}`
  );

  const {
    periode,
    dateFrom,
    dateTo,
    openFilter,
    filteredPlans,
    setFilteredPlans,
  } = useFinishedPlansState();

  useEffect(() => {
    if (!plans) return;

    const sortedPlansByCreatedAt = plans.sort((a, b) =>
      a.datum > b.datum ? -1 : 1
    );

    filterPlans(
      setFilteredPlans,
      sortedPlansByCreatedAt,
      filterTerm,
      dateFrom,
      dateTo,
      periode
    );
  }, [plans, filterTerm]);

  return (
    <div className="h-full">
      {!openFilter && (
        <>
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
        </>
      )}

      {openFilter && <PeriodFilter />}
    </div>
  );
}
