/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import Buttons from "./Buttons";
import Loading from "./Loading";
import ScrollButtonsLayout from "../../Common/ScrollButtonsLayout";
import { FlightPlanType } from "Types";
import { useReadData } from "utils/useReadData";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import SinglePlan from "./SinglePlan";
import Filter from "./Filter";
import { useFilterPlans } from "hooks/filters/useFilterPlans";
import CongfirmationModal from "./CongfirmationModal";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function RemoveFlightPlan() {
  const {
    setFilteredPlans,
    filteredPlans,
    filterTerm,
    setFilterTerm,
    openFilter,
  } = useDeleteFlightPlan();

  const filterPlans = useFilterPlans();

  const { user } = useAuth();
  
  const { data: plans, loading, refetch } = useReadData<FlightPlanType[]>(
    `/flightPlans?regio_id=${user.role}`
  );

  // const {
  //   data: plans,
  //   loading,
  //   refetch,
  // } = useReadData<FlightPlanType[]>(
  //   `/flightPlans/prepreparedFlightPlans?regio_id=${user.role}`
  // );

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

  return (
    <div className="h-full ">
      {!openFilter && (
        <ScrollButtonsLayout
          setFilterTerm={setFilterTerm}
          className="h-full"
          buttons={<Buttons />}
        >
          <div className="divide-y-2">
            {loading && <Loading />}

            {(!filteredPlans || filteredPlans.length === 0) && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-center text-gray-400 text-[12px]">
                  {content.voorbereiding.vluchtplanVerwijderen.noPlans}{" "}
                </p>
              </div>
            )}

            {!loading &&
              filteredPlans?.map((plan: FlightPlanType) => (
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
