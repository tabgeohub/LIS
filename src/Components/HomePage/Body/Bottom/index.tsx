import Head from "./Head";
import { useState } from "react";
import ClickedTableFunctions from "./ClickedTableFunctions";
import PointsView from "./PointsView";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import PlansView from "./PlansView";

export default function Bottom({
  vluchtnummer,
  containerHeight,
  containerWidth,
}: {
  vluchtnummer: string;
  containerHeight: number;
  containerWidth: number;
}) {
  const { view } = useOpenTable();

  const [showTableDiv, setShowTableDiv] = useState(false);

  return (
    <div className="relative h-full w-full min-w-0 max-w-full flex flex-col overflow-hidden">
      {showTableDiv && (
        <div className="absolute bottom-full right-4 w-full bg-white max-w-80 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-10">
          <ClickedTableFunctions />
        </div>
      )}

      <div className="shrink-0">
        <Head
          vluchtnummer={vluchtnummer}
          setShowTableDiv={setShowTableDiv}
          showTableDiv={showTableDiv}
        />
      </div>

      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        {view === "points" && (
          <PointsView
            containerHeight={containerHeight}
            containerWidth={containerWidth}
          />
        )}

        {view === "flightPlans" && (
          <PlansView
            containerHeight={containerHeight}
            containerWidth={containerWidth}
          />
        )}
      </div>
    </div>
  );
}
