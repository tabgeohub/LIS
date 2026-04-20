import {
  NabewerkingTabsType,
  PageType,
  ToolsTabsType,
  VoorbereidingTabsType,
} from "Types";

import { FaDrawPolygon, FaPlus } from "react-icons/fa6";
import { TbPointFilled } from "react-icons/tb";
import { HiDocumentAdd, HiTemplate } from "react-icons/hi";
import { IoDocumentsSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { GrDocumentMissing } from "react-icons/gr";
import { AiFillInfoCircle } from "react-icons/ai";
import { IconType } from "react-icons";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { GiPieChart } from "react-icons/gi";
import { RiFileList2Line } from "react-icons/ri";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RiRestartFill } from "react-icons/ri";
import { TiExport } from "react-icons/ti";
import { MdEdit } from "react-icons/md";

import content from "../../../constants/content.json";

export type Content = typeof content;

export const pages: {
  label: string;
  value: PageType;
  new?: boolean;
}[] = [
  {
    label: content.layout.pages.at(0)!,
    value: "voorbereiding",
  },
  {
    label: content.layout.pages.at(1)!,
    value: "nabewerking",
  },
  {
    label: content.layout.pages.at(2)!,
    value: "tools",
  },
  {
    label: content.layout.pages.at(3)!,
    value: "timeslider",
    new: true,
  },
];

export const voorbereidingTabs: {
  id: VoorbereidingTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
}[] = [
  {
    id: "enrichedAddPoint",
    label: content.voorbereiding.tabs.enrichedAddPoint,
    icon: TbPointFilled,
    disabled: false,
  },
  {
    id: "tekengereedschap",
    label: "Tekengereedschap",
    icon: FaDrawPolygon,
    disabled: false,
    new: true,
  },
  {
    id: "templateFlights",
    label: content.voorbereiding.tabs.templateFlights,
    icon: HiTemplate,
    disabled: false,
  },
  {
    id: "flightPlan",
    label: content.voorbereiding.tabs.flightPlan,
    icon: HiDocumentAdd,
    disabled: false,
  },
  {
    id: "reuseFlightPlan",
    label: content.voorbereiding.tabs.reuseFlightPlan,
    icon: IoDocumentsSharp,
    disabled: false,
  },
  {
    id: "prepareFlightPlan",
    label: content.voorbereiding.tabs.prepareFlightPlan,
    icon: FaCheck,
    disabled: false,
  },
  {
    id: "addPoint",
    label: content.voorbereiding.tabs.addPoint,
    icon: FaPlus,
    disabled: false,
  },
  {
    id: "removeFlightPlan",
    label: content.voorbereiding.tabs.removeFlightPlan,
    icon: GrDocumentMissing,
    disabled: false,
  },
  {
    id: "viewPlan",
    label: content.voorbereiding.tabs.viewPlan,
    icon: AiFillInfoCircle,
    disabled: false,
  },
];

export const toolsTabs: {
  id: ToolsTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
}[] = [
  {
    id: "emailijst",
    label: content.tools.tabs.emailijst,
    icon: IoNewspaperOutline,
    disabled: false,
  },
  {
    id: "verwijderen",
    label: content.tools.tabs.verwijderen,
    icon: MdDelete,
    disabled: false,
  },
  {
    id: "startgebied",
    label: content.tools.tabs.startgebied,
    icon: RiRestartFill,
    disabled: false,
  },
  {
    id: "exporteer",
    label: content.tools.tabs.exporteer,
    icon: TiExport,
    disabled: false,
  },
  {
    id: "editGeometry",
    label: content.tools.tabs.editGeometry,
    icon: MdEdit,
    disabled: false,
    new: true,
  },

    // {
  //   id: "bevragen",
  //   label: content.tools.tabs.bevragen,
  //   icon: PiPlusDuotone,
  //   disabled: false,
  // },
  // {
  //   id: "kaartlagen",
  //   label: content.tools.tabs.kaartlagen,
  //   icon: FaLayerGroup,
  //   disabled: false,
  // },
  // {
  //   id: "uploaden",
  //   label: content.tools.tabs.uploaden,
  //   icon: FaUpload,
  //   disabled: false,
  // },
];

export const nabewerkingTabs: {
  id: NabewerkingTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
}[] = [
  {
    id: "vluchtZoeken",
    label: content.nabewerking.tabs.vluchtZoeken,
    icon: FaMagnifyingGlassChart,
    disabled: false,
  },
  {
    id: "waarnemings",
    label: content.nabewerking.tabs.waarnemings,
    icon: GiPieChart,
    disabled: false,
  },
  {
    id: "vluchtplanStatus",
    label: content.nabewerking.tabs.vluchtplanStatus,
    icon: RiFileList2Line,
    disabled: false,
  },
];
