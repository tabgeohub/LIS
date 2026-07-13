import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";

import { FlightPlanType } from "Types";

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

import { useContent } from "hooks/useContent";
import { addPlanStarGraphics } from "hooks/hover-click-handlers/usePlanStarGraphic";
import MenuItem from "Components/HomePage/Body/Bottom/common/MenuItem";
import {
  exportSearchedFlightPlansCsv,
  exportSearchedFlightPlansShp,
  exportSearchedFlightPlansXlsx,
} from "../../shared/searchedResultsExports";

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

  const { setPointsTable, setOpenTable, setFlightPlans, setView } =
    useOpenTable();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  const tableView = () => {
    setOpenTable(true);
    setPointsTable([]);
    setView("points");
    setFlightPlans(flightPlansData);
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setOpenSearchedTab(false);
    setOpenSideBar(false);
  };

  const func = () => {};

  const selectAll = () => {
    if (!redGraphicsLayer) return;

    const newStars = flightPlansData.filter(
      (point) => !starredPlans.some((p) => p.id === point.id)
    );

    const combined = [...starredPlans, ...newStars];
    const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
    setStarredPlans(unique);

    addPlanStarGraphics({
      plans: newStars,
      layer: redGraphicsLayer,
      variant: "search",
    });
  };

  const exportCsv = () => exportSearchedFlightPlansCsv(flightPlansData);
  const exportXlsx = () => exportSearchedFlightPlansXlsx(flightPlansData);
  const exportShp = () => exportSearchedFlightPlansShp(flightPlansData);

  const content = useContent();
  const labels = content.layout.searchResult.listPointFunctions;

  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <MenuItem
        icon={<MdAddCircleOutline className="text-2xl text-primary mt-1" />}
        title={labels.addPoints.title}
        onClick={func}
        description={labels.addPoints.subtitle}
      />

      <MenuItem
        icon={<MdTableChart className="text-2xl text-primary mt-1" />}
        title={labels.tableView.title}
        onClick={tableView}
        description={labels.tableView.subtitle}
      />

      <MenuItem
        icon={<MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />}
        title={labels.zoomAll.title}
        onClick={func}
        description={labels.zoomAll.subtitle}
      />

      <MenuItem
        icon={<MdOutlineSelectAll className="text-2xl text-primary mt-1" />}
        title={labels.selectAll.title}
        onClick={selectAll}
        description={labels.selectAll.subtitle}
      />

      <MenuItem
        icon={<MdDonutLarge className="text-2xl text-primary mt-1" />}
        title={labels.bufferOptions.title}
        onClick={() => setFase("buffer")}
        description={labels.bufferOptions.subtitle}
      />

      <MenuItem
        icon={<BsFiletypeCsv className="text-2xl text-primary mt-1" />}
        title={labels.exportCsv.title}
        onClick={exportCsv}
        description={labels.exportCsv.subtitle}
      />

      <MenuItem
        icon={<BsFiletypeXlsx className="text-2xl text-primary mt-1" />}
        title={labels.exportXlsx.title}
        onClick={exportXlsx}
        description={labels.exportXlsx.subtitle}
      />

      <MenuItem
        icon={<BsFiletypeJson className="text-2xl text-primary mt-1" />}
        title={labels.exportShp.title}
        onClick={exportShp}
        description={labels.exportShp.subtitle}
      />

      <MenuItem
        icon={<MdFolderOpen className="text-2xl text-primary mt-1" />}
        title={labels.openSaved.title}
        onClick={func}
        description={labels.openSaved.subtitle}
      />

      <MenuItem
        icon={<MdSave className="text-2xl text-primary mt-1" />}
        title={labels.saveResults.title}
        onClick={func}
        description={labels.saveResults.subtitle}
      />

      <MenuItem
        icon={<MdLayers className="text-2xl text-primary mt-1" />}
        title={labels.combineResults.title}
        onClick={func}
        description={labels.combineResults.subtitle}
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={labels.removeFromResults.title}
        onClick={func}
        description={labels.removeFromResults.subtitle}
      />
    </div>
  );
}
