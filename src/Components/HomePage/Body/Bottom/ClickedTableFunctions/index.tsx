import { useOpenTable } from "@helpers/ZustandStates/showTable";
import PointsList from "./PointsList";
import PlansList from "./PlansList";

export default function ClickedTableFunctions() {
  const { view } = useOpenTable();

  return (
    <>
      {view === "points" && <PointsList />}

      {view === "flightPlans" && <PlansList />}
    </>
  );
}
