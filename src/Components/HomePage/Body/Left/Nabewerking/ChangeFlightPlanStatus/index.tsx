/* eslint-disable react-hooks/exhaustive-deps */
import { FlightPlanType } from "Types";
import SinglePlan from "./FlightPlan";
import Buttons from "./Buttons";
import ScrollButtonsLayout from "../../Common/ScrollButtonsLayout";
import { useFullPreparedFlightPlans } from "api-hooks/flightPlans";
import { useChangePlanStatusState } from "hooks/zustand/nabewerking/useChangePlanStatusState";
import Filter from "./Filter";
import { useFilterPlans } from "hooks/filters/useFilterPlans";
import { useEffect } from "react";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function ChangeFlightPlanStatus() {
  const { user } = useAuth();

  const { data: preparedFlightPlans } = useFullPreparedFlightPlans(
    user.role,
    user.user_id
  );

  const { setFilterTerm, openFilter, filterTerm } = useChangePlanStatusState();

  const content = useContent();

  const filterPlans = useFilterPlans();

  const { periode, dateFrom, dateTo, filteredPlans, setFilteredPlans } =
    useChangePlanStatusState();

  useEffect(() => {
    if (!preparedFlightPlans) return;

    filterPlans(
      setFilteredPlans,
      preparedFlightPlans,
      filterTerm,
      dateFrom,
      dateTo,
      periode
    );
  }, [preparedFlightPlans, filterTerm, periode]);

  return (
    <>
      {!openFilter && (
        <ScrollButtonsLayout
          setFilterTerm={setFilterTerm}
          buttons={<Buttons />}
          className="h-full"
        >
          <div className="divide-y-2">
            {(!filteredPlans || filteredPlans.length === 0) && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-center text-gray-400 text-[12px]">
                  {content.nabewerking.changeFlightPlanStatus.noPlans}
                </p>
              </div>
            )}

            {filteredPlans
              ?.filter((plan) =>
                plan.vluchtnummer
                  .toLowerCase()
                  .includes(filterTerm.toLowerCase())
              )
              .map((plan) => (
                <SinglePlan plan={plan} key={plan.id} />
              ))}
          </div>
        </ScrollButtonsLayout>
      )}

      {openFilter && <Filter />}
    </>
  );
}
