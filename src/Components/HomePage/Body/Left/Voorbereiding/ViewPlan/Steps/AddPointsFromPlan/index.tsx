import { useState } from "react";
import Tabs from "./Tabs";
import SelectFromSource from "./SelectFromSource";

export default function AddPointsFromPlan() {
  const [selectedTab, setSelectedTab] = useState<string>("flightplan");

  return (
    <>
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab === "flightplan" && (
        <SelectFromSource source="flightPlans" />
      )}

      {selectedTab === "template" && <SelectFromSource source="templates" />}
    </>
  );
}
