import { starAllPointsOnMap } from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import {
  downloadCsvFromRows,
  downloadEnrichedPointsShapefile,
  downloadXlsxFromRows,
} from "Components/HomePage/helpers/tableExports/pointsPlansTableExport";
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
import { EnrichedPointType } from "Types";
import SearchedResultsActionsMenu from "../shared/SearchedResultsActionsMenu";
import { useSearchedResultsDropdownChrome } from "../shared/useSearchedResultsDropdownChrome";

export default function DropDown({
  starredPoints,
  setStarredPoints,
  setOpenListPointDiv,
  pointsData,
  setFase,
}: {
  starredPoints: EnrichedPointType[];
  setStarredPoints: (value: EnrichedPointType[]) => void;
  setOpenListPointDiv: (value: boolean) => void;
  pointsData: EnrichedPointType[];
  setFase: (value: string) => void;
}) {
  const { graphicsLayer } = useMapViewState();
  const { table, labels, noop, closeSearchedAndOpenTable } =
    useSearchedResultsDropdownChrome();

  const tableView = () => {
    table.setOpenTable(true);
    table.setPointsTable(pointsData);
    table.setView("points");
    closeSearchedAndOpenTable();
  };
  const selectAll = () => {
    setOpenListPointDiv(false);
    starAllPointsOnMap({
      points: pointsData,
      starredPoints,
      setStarredPoints,
      graphicsLayer,
    });
  };

  return (
    <SearchedResultsActionsMenu
      actions={[
        { key: "add", icon: <MdAddCircleOutline className="text-2xl text-primary mt-1" />, title: labels.addPoints.title, description: labels.addPoints.subtitle, onClick: () => setFase("addPoint") },
        { key: "table", icon: <MdTableChart className="text-2xl text-primary mt-1" />, title: labels.tableView.title, description: labels.tableView.subtitle, onClick: tableView },
        { key: "zoom", icon: <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />, title: labels.zoomAll.title, description: labels.zoomAll.subtitle, onClick: noop },
        { key: "select", icon: <MdOutlineSelectAll className="text-2xl text-primary mt-1" />, title: labels.selectAll.title, description: labels.selectAll.subtitle, onClick: selectAll },
        { key: "buffer", icon: <MdDonutLarge className="text-2xl text-primary mt-1" />, title: labels.bufferOptions.title, description: labels.bufferOptions.subtitle, onClick: () => setFase("buffer") },
        { key: "csv", icon: <BsFiletypeCsv className="text-2xl text-primary mt-1" />, title: labels.exportCsv.title, description: labels.exportCsv.subtitle, onClick: () => downloadCsvFromRows({ rows: pointsData, filename: "plans_export.csv" }) },
        { key: "xlsx", icon: <BsFiletypeXlsx className="text-2xl text-primary mt-1" />, title: labels.exportXlsx.title, description: labels.exportXlsx.subtitle, onClick: () => downloadXlsxFromRows({ rows: pointsData, filename: "exports_xlsx.xlsx", sheetName: "FlightPlans" }) },
        { key: "shp", icon: <BsFiletypeJson className="text-2xl text-primary mt-1" />, title: labels.exportShp.title, description: labels.exportShp.subtitle, onClick: () => downloadEnrichedPointsShapefile(pointsData) },
        { key: "open", icon: <MdFolderOpen className="text-2xl text-primary mt-1" />, title: labels.openSaved.title, description: labels.openSaved.subtitle, onClick: noop },
        { key: "save", icon: <MdSave className="text-2xl text-primary mt-1" />, title: labels.saveResults.title, description: labels.saveResults.subtitle, onClick: noop },
        { key: "combine", icon: <MdLayers className="text-2xl text-primary mt-1" />, title: labels.combineResults.title, description: labels.combineResults.subtitle, onClick: noop },
        { key: "remove", icon: <MdDelete className="text-2xl text-primary mt-1" />, title: labels.removeFromResults.title, description: labels.removeFromResults.subtitle, onClick: noop },
      ]}
    />
  );
}
