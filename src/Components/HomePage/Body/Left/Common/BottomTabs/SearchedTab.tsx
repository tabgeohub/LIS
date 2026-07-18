import { FaInfoCircle } from "react-icons/fa";
import { BottomTabButton } from "./BottomTabButton";

export default function SearchedTab() {
  return (
    <BottomTabButton
      tabKey="searched"
      label={<span className="capitalize">Searched Resultaten</span>}
      Icon={FaInfoCircle}
      logMessage="User clicked on 'Searched Resultaten'"
      logStep="BottomTabs - SearchedTab"
      activeWhen={(tab) => tab === "result"}
    />
  );
}
