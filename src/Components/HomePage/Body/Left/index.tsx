/* eslint-disable react-hooks/exhaustive-deps */
import KaartLegend from "./Common/KaartLegend";
import { useTabState } from "@helpers/ZustandStates/tabState";
import SelectedPointTabs from "./Voorbereiding/SelectedPointTabs";
import Layout from "./Common/Layout";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import FiltersSection from "./Common/FiltersSection";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import TabHeader from "./Common/TabHeader";
import AddPointsVluchtPlan from "./Voorbereiding/AddPointsVluchtPlan";
import EnrichedAddPoint from "./Voorbereiding/EnrichedAddPoint";
import FlightPlan from "./Voorbereiding/FlightPlan";
import ViewPlan from "./Voorbereiding/ViewPlan";
import PrepareFlightPlan from "./Voorbereiding/PrepareFlightPlan";
import ReuseFlightPlan from "./Voorbereiding/ReuseFlightPlan";
import RemoveFlightPlan from "./Voorbereiding/RemoveFlightPlan";
import VluchtenZoeken from "./Nabewerking/VluchtenZoeken";
import CreateReport from "./Nabewerking/CreateReport";
import ChangeFlightPlanStatus from "./Nabewerking/ChangeFlightPlanStatus";
import AandachtspuntenVerwijderen from "./Tools/AandachtspuntenVerwijderen";
import Emailijst from "./Tools/Emailijst";
import ToevoegenKaartlagen from "./Tools/ToevoegenKaartlagen";
import Uploaden from "./Tools/Uploaden";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import ResultTab from "./Common/ResultTab";
import SearchedResultsTab from "./Common/SearchedResultsTab";
import TemplateFlight from "./Voorbereiding/TemplateFlight";
import DrawingTool from "./Voorbereiding/DrawingTool";

export default function Left({
  vluchtnummer,
  setVluchtnummer,
  bodyStyle,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
  bodyStyle: React.CSSProperties;
}) {
  const { selectedTab } = useTabState();
  const { selectedBottomTab } = useSelectedBottomTabState();

  const { user } = useAuth();

  const { selectedBasemap } = useSelectedBasemapState();

  const tabContentMap = {
    // Voorbereiding
    addPoint: AddPointsVluchtPlan,
    enrichedAddPoint: EnrichedAddPoint,
    templateFlights: TemplateFlight,
    flightPlan: FlightPlan,
    viewPlan: ViewPlan,
    prepareFlightPlan: PrepareFlightPlan,
    reuseFlightPlan: ReuseFlightPlan,
    removeFlightPlan: RemoveFlightPlan,
    // Nabewerking
    vluchtZoeken: VluchtenZoeken,
    waarnemings: CreateReport,
    vluchtplanStatus: ChangeFlightPlanStatus,
    // Tools
    verwijderen: AandachtspuntenVerwijderen,
    emailijst: Emailijst,
    kaartlagen: ToevoegenKaartlagen,
    uploaden: Uploaden,
    tekengereedschap: DrawingTool,
  };

  // @ts-ignore
  const ContentComponent = tabContentMap[selectedTab];

  return (
    <Layout bodyStyle={bodyStyle}>
      {user.user_id !== 0 && (
        <>
          {selectedTab !== "aandachtspuntenFilteren" && (
            <>
              <SelectedPointTabs />

              {selectedTab !== "bevragen" && <TabHeader />}

              {selectedBottomTab !== "Kaartlagenlijst" &&
                selectedBottomTab !== "viewSelectedPointDetails" &&
                selectedBottomTab !== "editSelectedPoint" &&
                selectedBottomTab !== "deletePoint" &&
                selectedBottomTab !== "viewPlans" &&
                selectedBottomTab !== "addPoint" &&
                selectedBottomTab !== "addToPlan" &&
                selectedBottomTab !== "result" &&
                selectedBottomTab !== "searched" && (
                  <>
                    <div className="h-[100%]">
                      {ContentComponent && (
                        <ContentComponent
                          vluchtnummer={vluchtnummer}
                          setVluchtnummer={setVluchtnummer}
                          basemapString={selectedBasemap}
                        />
                      )}
                    </div>
                  </>
                )}

              {selectedBottomTab === "result" && <ResultTab />}

              {selectedBottomTab === "searched" && <SearchedResultsTab />}

              <KaartLegend />
            </>
          )}

          {selectedTab === "aandachtspuntenFilteren" && <FiltersSection />}
        </>
      )}
    </Layout>
  );
}
