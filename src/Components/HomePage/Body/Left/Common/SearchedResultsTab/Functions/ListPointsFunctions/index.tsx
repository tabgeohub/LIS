import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useOpenTable } from "hooks/zustand/ui/showTable";
import { useTabState } from "hooks/zustand/ui/tabState";
import { EnrichedPointType, FlightPlanType } from "Types";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { useOpenSearchedTab } from "hooks/zustand/ui/showSearchedTab";
import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import {
  MdDonutLarge,
  MdFolderOpen,
  MdLayers,
  MdOutlineZoomOutMap,
  MdSave,
  MdTableChart,
} from "react-icons/md";
import { useContent } from "hooks/useContent";
import {
  exportPointsPlansCsv,
  exportPointsPlansGeoJsonZip,
  exportPointsPlansXlsx,
} from "Components/HomePage/helpers/tableExports/pointsPlansTableExport";
import SearchedResultsActionsMenu from "../../shared/SearchedResultsActionsMenu";

export default function ListPointFunctions({
  setFase,
  pointsData,
  flightPlansData,
}: {
  setFase: (value: string) => void;
  pointsData: EnrichedPointType[];
  flightPlansData: FlightPlanType[];
}) {
  const { setPointsTable, setView, setOpenTable, setFlightPlans } =
    useOpenTable();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  const tableView = () => {
    setOpenTable(true);
    setPointsTable(pointsData);
    setFlightPlans(flightPlansData);
    setView("points");
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setOpenSearchedTab(false);
    setOpenSideBar(false);
  };

  const exportCsv = async () => {
    await exportPointsPlansCsv({
      points: pointsData as EnrichedPointType[],
      plans: flightPlansData as FlightPlanType[],
    });
  };

  const exportXlsx = async () => {
    await exportPointsPlansXlsx({
      points: pointsData as EnrichedPointType[],
      plans: flightPlansData as FlightPlanType[],
    });
  };

  const exportShp = async () => {
    if (!pointsData?.length) {
      alert("No points to export.");
      return;
    }
    await exportPointsPlansGeoJsonZip({
      points: pointsData,
      plans: flightPlansData as FlightPlanType[],
    });
  };

  const content = useContent();

  const labels = content.layout.searchResult.listPointFunctions;
  const noop = () => {};
  return (
    <SearchedResultsActionsMenu
      actions={[
        { key: "table", icon: <MdTableChart className="text-2xl text-primary mt-1" />, title: labels.tableView.title, description: labels.tableView.subtitle, onClick: tableView },
        { key: "zoom", icon: <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />, title: labels.zoomAll.title, description: labels.zoomAll.subtitle, onClick: noop },
        { key: "buffer", icon: <MdDonutLarge className="text-2xl text-primary mt-1" />, title: labels.bufferOptions.title, description: labels.bufferOptions.subtitle, onClick: () => setFase("buffer") },
        { key: "csv", icon: <BsFiletypeCsv className="text-2xl text-primary mt-1" />, title: labels.exportCsv.title, description: labels.exportCsv.subtitle, onClick: exportCsv },
        { key: "xlsx", icon: <BsFiletypeXlsx className="text-2xl text-primary mt-1" />, title: labels.exportXlsx.title, description: labels.exportXlsx.subtitle, onClick: exportXlsx },
        { key: "shp", icon: <BsFiletypeJson className="text-2xl text-primary mt-1" />, title: labels.exportShp.title, description: labels.exportShp.subtitle, onClick: exportShp },
        { key: "open", icon: <MdFolderOpen className="text-2xl text-primary mt-1" />, title: labels.openSaved.title, description: labels.openSaved.subtitle, onClick: noop },
        { key: "save", icon: <MdSave className="text-2xl text-primary mt-1" />, title: labels.saveResults.title, description: labels.saveResults.subtitle, onClick: noop },
        { key: "combine", icon: <MdLayers className="text-2xl text-primary mt-1" />, title: labels.combineResults.title, description: labels.combineResults.subtitle, onClick: noop },
      ]}
    />
  );
}
