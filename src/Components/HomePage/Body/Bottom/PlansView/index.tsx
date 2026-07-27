import { useState, type ReactNode } from "react";
import TabsComp from "./TabsComp";

import Details from "./Details";
import GpsLocations from "./GpsLocations";
import GpsTracks from "./GpsTracks";
import WayPoints from "./Waypoints";
import Tracks from "./Tracks";

const TAB_CONTENT: Record<string, () => ReactNode> = {
  Details: () => <Details />,
  Gps_tracks: () => <GpsTracks />,
  Gps_locaties: () => <GpsLocations />,
  Waypoints: () => <WayPoints />,
  Tracks: () => <Tracks />,
};

export default function PlansView({
  containerHeight,
  containerWidth,
}: {
  containerHeight: number;
  containerWidth: number;
}) {
  const [activeTab, setActiveTab] = useState<string>("Details");

  const renderTabContent = () => {
    const render = TAB_CONTENT[activeTab];
    if (!render) return null;
    return render();
  };

  return (
    <div
      className="h-full w-full flex flex-col min-w-0"
      style={{
        maxHeight: containerHeight ? `${containerHeight}px` : undefined,
      }}
    >
      <div className="shrink-0">
        <TabsComp activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div
        className="flex-1 min-h-0 min-w-0 overflow-hidden"
        style={{
          maxHeight: containerHeight ? `${containerHeight}px` : undefined,
        }}
      >
        <div
          className="h-full w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto thin-scrollbar"
          style={{
            maxHeight: containerHeight ? `${containerHeight}px` : undefined,
          }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
