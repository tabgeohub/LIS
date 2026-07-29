import { useTabState } from "hooks/zustand/ui/tabState";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useEffect } from "react";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import HeaderButtons from "./HeaderButtons";
import Pages from "./Common/Pages";

export default function HeaderTabs() {
  const { selectedTab } = useTabState();

  const { mapView } = useMapViewState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();

  useEffect(() => {
    setSelectedBottomTab(
      selectedTab !== "none" ? "topTabs" : "Kaartlagenlijst"
    );

    if (mapView) mapView.graphics.removeAll();
  }, [selectedTab, mapView, setSelectedBottomTab]);

  return (
    <div>
      <Pages />

      <HeaderButtons />
    </div>
  );
}
