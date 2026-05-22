import { FlightPlanType } from "Types";
import Details from "./Details";
import Header from "./Header";

export default function FlightPlanDetails({
  flightPlan,
  setFlightPlanDetails,
}: {
  flightPlan: FlightPlanType;
  setFlightPlanDetails: (value: boolean) => void;
}) {
  return (
    <div>
      <Header
        flightPlan={flightPlan}
        setFlightPlanDetails={setFlightPlanDetails}
      />

      {flightPlan && <Details flightPlan={flightPlan} />}
    </div>
  );
}
