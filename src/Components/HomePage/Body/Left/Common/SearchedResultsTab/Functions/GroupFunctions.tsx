import { useStarredAll } from "@helpers/ZustandStates/starredAll";
import { FaListAlt, FaSave, FaFolderOpen } from "react-icons/fa";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { PiSelectionForegroundThin } from "react-icons/pi";
import { TbBorderOuter, TbLayersLinked } from "react-icons/tb";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import type { SearchedResultsTargetProps } from "../shared/searchedResultsTargetProps";
import { createSearchedResultsExportHandlers } from "../shared/searchedResultsExports";
import GroupFunctionsButtonItem from "./GroupFunctionsButtonItem";

export default function GroupFunctions({
  setFase,
  target,
  pointsData,
  flightPlansData,
}: SearchedResultsTargetProps) {
  const logAction = useLogAction();
  const { setStarredAll } = useStarredAll();
  const content = useContent();

  const { exportCsv, exportXlsx, exportShp } = createSearchedResultsExportHandlers({
    target,
    pointsData,
    flightPlansData,
    logAction,
  });

  const selectAll = () => {
    setStarredAll(true);

    logAction({
      message: "User selected all items",
      step: `Searched results - ${target} drop down`,
    });
  };

  const labels = content.layout.searchResult.listPointFunctions;

  return (
    <div className="bg-white max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50">
      <GroupFunctionsButtonItem
        target={target}
        icon={<FaListAlt />}
        title={labels.zoomAll.title}
        description={labels.zoomAll.subtitle}
        onClick={() => {}}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<PiSelectionForegroundThin />}
        title={labels.selectAll.title}
        description={labels.selectAll.subtitle}
        onClick={selectAll}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<TbBorderOuter />}
        title={labels.bufferOptions.title}
        description={labels.bufferOptions.subtitle}
        onClick={() => setFase("buffer")}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<BsFiletypeCsv />}
        title={labels.exportCsv.title}
        description={labels.exportCsv.subtitle}
        onClick={exportCsv}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<BsFiletypeXlsx />}
        title={labels.exportXlsx.title}
        description={labels.exportXlsx.subtitle}
        onClick={exportXlsx}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<BsFiletypeJson />}
        title={labels.exportShp.title}
        description={labels.exportShp.subtitle}
        onClick={exportShp}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<FaFolderOpen />}
        title={labels.openSaved.title}
        description={labels.openSaved.subtitle}
        onClick={() => {}}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<FaSave />}
        title={labels.saveResults.title}
        description={labels.saveResults.subtitle}
        onClick={() => {}}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<TbLayersLinked />}
        title={labels.combineResults.title}
        description={labels.combineResults.subtitle}
        onClick={() => {}}
      />

      <GroupFunctionsButtonItem
        target={target}
        icon={<MdDeleteOutline />}
        title={labels.removeFromResults.title}
        description={labels.removeFromResults.subtitle}
        onClick={() => {}}
      />
    </div>
  );
}
