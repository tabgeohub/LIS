import { useTabState } from "@helpers/ZustandStates/tabState";
import { useViewPlanState } from "../../Voorbereiding/ViewPlan/helpers/useViewPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useContent } from "hooks/useContent";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useFilterState } from "@helpers/ZustandStates/filterState";

export default function TabHeader() {
  const { selectedTab, setSelectedTab } = useTabState();
  const { graphicsLayerHover, graphicsLayer, yellowGraphicsLayer } =
    useMapViewState();
  const { setSelectedIndex } = useViewPlanState();

  const { resetFeatures } = useResetFeatures();

  const {
    setNaamAandachtspunt,
    setActiviteit,
    setOrganisatie,
    setVan,
    setTot,
    setHerhalen,
  } = useFilterState();

  const content = useContent();

  function resetFilters() {
    setNaamAandachtspunt("");
    setActiviteit("");
    setOrganisatie("");
    setVan("");
    setTot("");
    setHerhalen("");

    resetFeatures();

    setSelectedTab("none");
  }

  function handleClose() {
    setSelectedTab("none");

    if (selectedTab === "viewPlan") {
      setSelectedIndex(0);

      resetFeatures();

      graphicsLayer?.removeAll();
      graphicsLayerHover?.removeAll();
    }

    if (selectedTab === "aandachtspuntenFilteren") {
      resetFilters();
    }

    yellowGraphicsLayer?.graphics.removeAll();
  }

  const tabHeader = {
    addPoint: content.layout.tabHeaders.addPoint,
    enrichedAddPoint: content.layout.tabHeaders.enrichedAddPoint,
    templateFlights: content.layout.tabHeaders.templateFlights,
    flightPlan: content.layout.tabHeaders.flightPlan,
    viewPlan: content.layout.tabHeaders.viewPlan,
    prepareFlightPlan: content.layout.tabHeaders.prepareFlightPlan,
    removeFlightPlan: content.layout.tabHeaders.removeFlightPlan,
    aandachtspuntenFilteren: content.layout.tabHeaders.aandachtspuntenFilteren,
    bevragen: content.layout.tabHeaders.bevragen,
    vluchtZoeken: content.layout.tabHeaders.vluchtZoeken,
    timeslider: content.layout.pages.at(3),
    reuseFlightPlan: content.layout.tabHeaders.reuseFlightPlan,
    waarnemings: content.layout.tabHeaders.waarnemings,
    vluchtplanStatus: content.layout.tabHeaders.vluchtplanStatus,
    verwijderen: content.layout.tabHeaders.verwijderen,
    emailijst: content.layout.tabHeaders.emailijst,
    tekengereedschap: content.layout.tabHeaders.tekengereedschap,
    editGeometry: content.layout.tabHeaders.editGeometry,
  };

  // @ts-ignore
  const tabHeaderText = tabHeader[selectedTab];

  const { selectedBottomTab } = useSelectedBottomTabState();

  return (
    <div>
      {selectedTab !== "none" &&
        selectedBottomTab !== "result" &&
        selectedBottomTab !== "searched" && (
          <>
            <div className="relative flex items-center justify-center mt-2">
              <h4 className="text-md text-gray-400">{tabHeaderText}</h4>
              <button
                onClick={handleClose}
                className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 -top-1"
              >
                x
              </button>
            </div>

            <div className="h-[1px] w-full bg-gray-200 mt-3" />
          </>
        )}
    </div>
  );
}
