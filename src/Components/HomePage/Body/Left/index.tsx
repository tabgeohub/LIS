/* eslint-disable react-hooks/exhaustive-deps */
import KaartLegend from "./Common/KaartLegend";
import { useTabState } from "hooks/zustand/ui";
import SelectedPointTabs from "Components/Voorbereiding/SelectedPointTabs";
import Layout from "./Common/Layout";
import { useAuth } from "hooks/zustand/ui";
import FiltersSection from "./Common/FiltersSection";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import TabHeader from "./Common/TabHeader";
import AddPointsVluchtPlan from "Components/Voorbereiding/AddPointsVluchtPlan";
import EnrichedAddPoint from "Components/Voorbereiding/EnrichedAddPoint";
import FlightPlan from "Components/Voorbereiding/FlightPlan";
import ViewPlan from "Components/Voorbereiding/ViewPlan";
import PrepareFlightPlan from "Components/Voorbereiding/PrepareFlightPlan";
import ReuseFlightPlan from "Components/Voorbereiding/ReuseFlightPlan";
import RemoveFlightPlan from "Components/Voorbereiding/RemoveFlightPlan";
import VluchtenZoeken from "Components/Nabewerking/VluchtenZoeken";
import CreateReport from "Components/Nabewerking/CreateReport";
import ChangeFlightPlanStatus from "Components/Nabewerking/ChangeFlightPlanStatus";
import AandachtspuntenVerwijderen from "Components/HomePageTools/AandachtspuntenVerwijderen";
import Emailijst from "Components/HomePageTools/Emailijst";
import ToevoegenKaartlagen from "Components/HomePageTools/ToevoegenKaartlagen";
import Uploaden from "Components/HomePageTools/Uploaden";
import EditGeometry from "Components/HomePageTools/EditGeometry";
import { useSelectedBasemapState } from "Components/HomePage/hooks/kaartlagen/useBasemapStore";
import ResultTab from "./Common/ResultTab";
import SearchedResultsTab from "./Common/SearchedResultsTab";
import TemplateFlight from "Components/Voorbereiding/TemplateFlight";
import DrawingTool from "Components/Voorbereiding/DrawingTool";
import TimeSlider from "./TimeSlider";

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
    timeslider: TimeSlider,
    waarnemings: CreateReport,
    vluchtplanStatus: ChangeFlightPlanStatus,
    // Tools
    verwijderen: AandachtspuntenVerwijderen,
    emailijst: Emailijst,
    kaartlagen: ToevoegenKaartlagen,
    uploaden: Uploaden,
    tekengereedschap: DrawingTool,
    editGeometry: EditGeometry,
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
