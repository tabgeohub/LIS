import type { ReactNode } from "react";
import { MdOutlineZoomOutMap, MdTableChart } from "react-icons/md";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";

type Copy = { title: string; subtitle: string };

export type PointsListItemSpec = {
  icon: ReactNode;
  copy: Copy;
  onClick: () => void;
};

type BuildSpecsInput = {
  list: {
    listView: Copy;
    zoomToAll: Copy;
    exportCsv: Copy;
    exportXlsx: Copy;
    exportShp: Copy;
  };
  actions: {
    listView: () => void;
    zoomToPoints: () => void;
    exportCsv: () => void;
    exportXlsx: () => void;
    exportShp: () => void;
  };
};

export function buildPointsListItemSpecs(
  input: BuildSpecsInput
): PointsListItemSpec[] {
  const { list, actions } = input;
  return [
    { icon: <MdTableChart />, copy: list.listView, onClick: actions.listView },
    {
      icon: <MdOutlineZoomOutMap />,
      copy: list.zoomToAll,
      onClick: actions.zoomToPoints,
    },
    { icon: <BsFiletypeCsv />, copy: list.exportCsv, onClick: actions.exportCsv },
    { icon: <BsFiletypeXlsx />, copy: list.exportXlsx, onClick: actions.exportXlsx },
    { icon: <BsFiletypeJson />, copy: list.exportShp, onClick: actions.exportShp },
  ];
}
