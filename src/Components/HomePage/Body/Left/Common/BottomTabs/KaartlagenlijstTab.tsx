import { FaLayerGroup } from "react-icons/fa6";
import { BottomTabButton } from "./BottomTabButton";

export default function KaartlagenlijstTab() {
  return (
    <BottomTabButton
      tabKey="Kaartlagenlijst"
      label="Kaartlagenlijst"
      Icon={FaLayerGroup}
      logMessage="User clicked on 'KaartlagenlijstTab' in the 'BottomTabs' component"
      logStep="BottomTabs"
    />
  );
}
