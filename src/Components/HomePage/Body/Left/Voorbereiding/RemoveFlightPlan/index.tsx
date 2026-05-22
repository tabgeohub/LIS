/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import Buttons from "./Buttons";
import Loading from "./Loading";
import ScrollButtonsLayout from "../../Common/ScrollButtonsLayout";
import { FlightPlanType } from "Types";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import SinglePlan from "./SinglePlan";
import Filter from "./Filter";
import { useFilterPlans } from "hooks/filters/useFilterPlans";
import CongfirmationModal from "./CongfirmationModal";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "hooks/queries/useFlightPlanQueries";

export default function RemoveFlightPlan() {
  const {
    setFilteredPlans,
    filteredPlans,
    filterTerm,
    setFilterTerm,
    openFilter,
  } = useDeleteFlightPlan();

  const [showAllPlans, setShowAllPlans] = useState(false);

  const filterPlans = useFilterPlans();

  const { user } = useAuth();
  const {
    data,
    isPending,
    refetch: refetchFlightPlans,
  } = useFlightPlansList(user.role, user.user_id);

  const plans = data ?? EMPTY_FLIGHT_PLANS;

  const loading = isPending;
  const refetch = () => {
    if (user.user_id === undefined || user.user_id === 0) return;
    refetchFlightPlans();
  };

  useEffect(() => {
    if (!plans) return;

    setFilteredPlans(
      plans.filter((plan: FlightPlanType) =>
        plan.vluchtnummer.toLowerCase().includes(filterTerm.toLowerCase())
      )
    );
  }, [plans]);

  useEffect(() => {
    if (!plans) return;

    filterPlans(setFilteredPlans, plans, filterTerm);
  }, [filterTerm]);

  useEffect(() => {
    setFilterTerm("");
  }, []);

  const content = useContent();

  const allPlans = useMemo(() => {
    if (showAllPlans) {
      return plans;
    } else {
      return plans?.filter((plan: FlightPlanType) => plan.status !== "finished" && plan.status !== "in-progress");
    }
  }, [plans, showAllPlans]);

  return (
    <div className="h-full ">
      {!openFilter && (
        <ScrollButtonsLayout
          setFilterTerm={setFilterTerm}
          className="h-full "
          buttons={<Buttons />}
        >
          <div className="divide-y-2 pt-6">
            <div className="flex items-center gap-x-1 absolute top-20 left-0 z-10 px-1 py-1 bg-white border-b border-t border-gray-300 w-full">
              <input type="checkbox" className="cursor-pointer" id="allPlans" checked={showAllPlans} onChange={() => setShowAllPlans(!showAllPlans)} />
              <label htmlFor="allPlans" className="text-[12px] cursor-pointer text-primary font-semibold">Alle vluchtplannen</label>
            </div>


            {loading && <Loading />}

            {(!allPlans || allPlans.length === 0) && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-center text-gray-400 text-[12px]">
                  {content.voorbereiding.vluchtplanVerwijderen.noPlans}{" "}
                </p>
              </div>
            )}

            {!loading &&
              allPlans?.map((plan: FlightPlanType) => (
                <SinglePlan key={plan.id} plan={plan} />
              ))}
          </div>
        </ScrollButtonsLayout>
      )}

      <CongfirmationModal refetch={refetch} />

      {openFilter && plans && <Filter plans={plans} />}
    </div>
  );
}
