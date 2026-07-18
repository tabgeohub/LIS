import { FaDrawPolygon } from "react-icons/fa6";
import { TbPointFilled } from "react-icons/tb";
import { HiDocumentAdd, HiTemplate } from "react-icons/hi";
import { IoDocumentsSharp } from "react-icons/io5";
import content from "../../../../constants/content.json";
import type { VoorbereidingTabDef } from "./voorbereidingTabDef";

export const voorbereidingTabsPart1: VoorbereidingTabDef[] = [
  { id: "enrichedAddPoint", label: content.voorbereiding.tabs.enrichedAddPoint, icon: TbPointFilled, disabled: false },
  { id: "tekengereedschap", label: "Tekengereedschap", icon: FaDrawPolygon, disabled: false, new: true },
  { id: "templateFlights", label: content.voorbereiding.tabs.templateFlights, icon: HiTemplate, disabled: false },
  { id: "flightPlan", label: content.voorbereiding.tabs.flightPlan, icon: HiDocumentAdd, disabled: false },
  { id: "reuseFlightPlan", label: content.voorbereiding.tabs.reuseFlightPlan, icon: IoDocumentsSharp, disabled: false },
];
