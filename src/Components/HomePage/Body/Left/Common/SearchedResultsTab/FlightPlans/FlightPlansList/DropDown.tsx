import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useContent } from "hooks/useContent";
import { addPlanStarGraphics } from "@helpers/ArcGISHelpers/planStarGraphics";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import {
  MdAddCircleOutline,
  MdDelete,
  MdDonutLarge,
  MdFolderOpen,
  MdLayers,
  MdOutlineSelectAll,
  MdOutlineZoomOutMap,
  MdSave,
  MdTableChart,
} from "react-icons/md";
import { FlightPlanType } from "Types";
import {
  exportSearchedFlightPlansCsv,
  exportSearchedFlightPlansShp,
  exportSearchedFlightPlansXlsx,
} from "../../shared/searchedResultsExports";
import SearchedResultsActionsMenu from "../../shared/SearchedResultsActionsMenu";

export default function DropDown({
  starredPlans,
  setStarredPlans,
  flightPlansData,
  setFase,
}: {
  starredPlans: FlightPlanType[];
  setStarredPlans: (value: FlightPlanType[]) => void;
  flightPlansData: FlightPlanType[];
  setFase: (value: string) => void;
}) {
  const { redGraphicsLayer } = useMapViewState();
  const table = useOpenTable();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();
  const labels = useContent().layout.searchResult.listPointFunctions;
  const noop = () => {};

  const tableView = () => {
    table.setOpenTable(true);
    table.setPointsTable([]);
    table.setView("points");
    table.setFlightPlans(flightPlansData);
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setOpenSearchedTab(false);
    setOpenSideBar(false);
  };
  const selectAll = () => {
    if (!redGraphicsLayer) return;
    const newStars = flightPlansData.filter(
      (plan) => !starredPlans.some((starred) => starred.id === plan.id)
    );
    const combined = [...starredPlans, ...newStars];
    setStarredPlans(Array.from(new Map(combined.map((plan) => [plan.id, plan])).values()));
    addPlanStarGraphics({ plans: newStars, layer: redGraphicsLayer, variant: "search" });
  };

  return (
    <SearchedResultsActionsMenu
      actions={[
        { key: "add", icon: <MdAddCircleOutline className="text-2xl text-primary mt-1" />, title: labels.addPoints.title, description: labels.addPoints.subtitle, onClick: noop },
        { key: "table", icon: <MdTableChart className="text-2xl text-primary mt-1" />, title: labels.tableView.title, description: labels.tableView.subtitle, onClick: tableView },
        { key: "zoom", icon: <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />, title: labels.zoomAll.title, description: labels.zoomAll.subtitle, onClick: noop },
        { key: "select", icon: <MdOutlineSelectAll className="text-2xl text-primary mt-1" />, title: labels.selectAll.title, description: labels.selectAll.subtitle, onClick: selectAll },
        { key: "buffer", icon: <MdDonutLarge className="text-2xl text-primary mt-1" />, title: labels.bufferOptions.title, description: labels.bufferOptions.subtitle, onClick: () => setFase("buffer") },
        { key: "csv", icon: <BsFiletypeCsv className="text-2xl text-primary mt-1" />, title: labels.exportCsv.title, description: labels.exportCsv.subtitle, onClick: () => exportSearchedFlightPlansCsv(flightPlansData) },
        { key: "xlsx", icon: <BsFiletypeXlsx className="text-2xl text-primary mt-1" />, title: labels.exportXlsx.title, description: labels.exportXlsx.subtitle, onClick: () => exportSearchedFlightPlansXlsx(flightPlansData) },
        { key: "shp", icon: <BsFiletypeJson className="text-2xl text-primary mt-1" />, title: labels.exportShp.title, description: labels.exportShp.subtitle, onClick: () => exportSearchedFlightPlansShp(flightPlansData) },
        { key: "open", icon: <MdFolderOpen className="text-2xl text-primary mt-1" />, title: labels.openSaved.title, description: labels.openSaved.subtitle, onClick: noop },
        { key: "save", icon: <MdSave className="text-2xl text-primary mt-1" />, title: labels.saveResults.title, description: labels.saveResults.subtitle, onClick: noop },
        { key: "combine", icon: <MdLayers className="text-2xl text-primary mt-1" />, title: labels.combineResults.title, description: labels.combineResults.subtitle, onClick: noop },
        { key: "remove", icon: <MdDelete className="text-2xl text-primary mt-1" />, title: labels.removeFromResults.title, description: labels.removeFromResults.subtitle, onClick: noop },
      ]}
    />
  );
}
