/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import SinglePlan from "./SinglePlan";
import Buttons from "./Buttons";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { FlightPlanType } from "Types";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import Filter from "../../Common/Filter";
import Loading from "../../Common/Loading";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useFlightPlansStore } from "hooks/features/useFlightPlansStore";
import { useEffect } from "react";

export default function Step1() {
  const { openFilter, filterTerm, setFilterTerm } = useReuseFlightPlan();

  const { user } = useAuth();
  const { flightPlans, fetchFlightPlans } = useFlightPlansStore();

  // Fetch flight plans when component mounts or user changes
  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchFlightPlans(user.role);
  }, [user.user_id, user.role, fetchFlightPlans]);

  const plans = flightPlans;
  const loading = flightPlans.length === 0 && user.user_id !== undefined && user.user_id !== 0;

  const filteredPlans = useMemo(() => {
    if (!plans) return [];

    return plans.filter((plan: FlightPlanType) =>
      plan.vluchtnummer.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [plans, filterTerm]);

  return (
    <div className="h-full">
      {!openFilter && (
        <ScrollButtonsLayout
          setFilterTerm={setFilterTerm}
          buttons={<Buttons />}
        >
          <div className="divide-y-2">
            {loading && <Loading />}

            {!loading &&
              filteredPlans
                .filter(
                  (plan) => !plan.vluchtnummer.toLowerCase().includes("shape")
                )
                ?.map((plan: FlightPlanType) => (
                  <SinglePlan key={plan.id} plan={plan} />
                ))}
          </div>
        </ScrollButtonsLayout>
      )}

      {openFilter && plans && <Filter plans={plans} />}
    </div>
  );
}
