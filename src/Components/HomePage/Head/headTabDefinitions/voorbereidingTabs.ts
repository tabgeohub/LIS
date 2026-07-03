import { VoorbereidingTabsType } from "Types";
import { FaDrawPolygon, FaPlus } from "react-icons/fa6";
import { TbPointFilled } from "react-icons/tb";
import { HiDocumentAdd, HiTemplate } from "react-icons/hi";
import { IoDocumentsSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { GrDocumentMissing } from "react-icons/gr";
import { AiFillInfoCircle } from "react-icons/ai";
import { IconType } from "react-icons";
import content from "../../../../constants/content.json";

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
