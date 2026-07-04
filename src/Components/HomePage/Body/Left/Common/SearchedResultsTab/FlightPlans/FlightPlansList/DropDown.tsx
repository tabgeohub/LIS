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
  downloadCsvFromRows,
  downloadXlsxFromRows,
  exportFlightPlansShapefile,
} from "@helpers/tableExports/pointsPlansTableExport";

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

  const exportCsv = async () => {
    downloadCsvFromRows({
      rows: flightPlansData,
      filename: "plans_export.csv",
      excludeKeys: ["points"],
    });
  };

  const exportXlsx = async () => {
    const cleanedPlans = flightPlansData.map(({ points, ...rest }) => rest);
    downloadXlsxFromRows({
      rows: cleanedPlans,
      filename: "exports_xlsx.xlsx",
      sheetName: "FlightPlans",
    });
  };

  const exportShp = async () => {
    await exportFlightPlansShapefile(flightPlansData);
  };

  const content = useContent();

  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <MenuItem
        icon={<MdAddCircleOutline className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.addPoints.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.addPoints.subtitle
        }
      />

      <MenuItem
        icon={<MdTableChart className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.tableView.title}
        onClick={tableView}
        description={
          content.layout.searchResult.listPointFunctions.tableView.subtitle
        }
      />

      <MenuItem
        icon={<MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.zoomAll.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.zoomAll.subtitle
        }
      />

      <MenuItem
        icon={<MdOutlineSelectAll className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.selectAll.title}
        onClick={selectAll}
        description={
          content.layout.searchResult.listPointFunctions.selectAll.subtitle
        }
      />

      <MenuItem
        icon={<MdDonutLarge className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.bufferOptions.title
        }
        onClick={() => setFase("buffer")}
        description={
          content.layout.searchResult.listPointFunctions.bufferOptions.subtitle
        }
      />

      <MenuItem
        icon={<BsFiletypeCsv className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportCsv.title}
        onClick={exportCsv}
        description={
          content.layout.searchResult.listPointFunctions.exportCsv.subtitle
        }
      />

      <MenuItem
        icon={<BsFiletypeXlsx className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportXlsx.title}
        onClick={exportXlsx}
        description={
          content.layout.searchResult.listPointFunctions.exportXlsx.subtitle
        }
      />

      <MenuItem
        icon={<BsFiletypeJson className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportShp.title}
        onClick={exportShp}
        description={
          content.layout.searchResult.listPointFunctions.exportShp.subtitle
        }
      />

      <MenuItem
        icon={<MdFolderOpen className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.openSaved.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.openSaved.subtitle
        }
      />

      <MenuItem
        icon={<MdSave className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.saveResults.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.saveResults.subtitle
        }
      />

      <MenuItem
        icon={<MdLayers className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.combineResults.title
        }
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.combineResults.subtitle
        }
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.removeFromResults.title
        }
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.removeFromResults
            .subtitle
        }
      />
    </div>
  );
}
