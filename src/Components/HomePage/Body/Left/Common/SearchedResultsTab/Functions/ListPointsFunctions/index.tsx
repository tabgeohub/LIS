import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { EnrichedPointType, FlightPlanType } from "Types";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
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
} from "@helpers/tableExports/pointsPlansTableExport";

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

  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={tableView}
      >
        <div>
          <MdTableChart className="text-2xl text-primary mt-1" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.tableView.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.tableView.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.zoomAll.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.zoomAll.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={() => setFase("buffer")}
      >
        <MdDonutLarge className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.bufferOptions.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.bufferOptions
                .subtitle
            }
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={exportCsv}
      >
        <BsFiletypeCsv className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportCsv.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportCsv.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={exportXlsx}
      >
        <BsFiletypeXlsx className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportXlsx.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportXlsx.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={exportShp}
      >
        <BsFiletypeJson className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportShp.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportShp.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdFolderOpen className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.openSaved.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.openSaved.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdSave className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.saveResults.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.saveResults
                .subtitle
            }
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdLayers className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {
              content.layout.searchResult.listPointFunctions.combineResults
                .title
            }
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.combineResults
                .subtitle
            }
          </p>
        </div>
      </div>
    </div>
  );
}
