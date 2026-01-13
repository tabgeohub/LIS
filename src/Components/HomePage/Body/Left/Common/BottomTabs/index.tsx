import { useAuth } from "@helpers/ZustandStates/useAuth";
import EditPointTabs from "./EditPointTabs";
import KaartlagenlijstTab from "./KaartlagenlijstTab";
import SelectedTab from "./SelectedTab";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import ResultTab from "./ResultTab";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import SearchedTab from "./SearchedTab";

export default function BottomTabs() {
  const { user } = useAuth();
  const { openResultTab } = useOpenResultTab();
  const { openSearchedTab } = useOpenSearchedTab();

  return (
    <>
      {user.user_id !== 0 && (
        <div className="flex h-full">
          <KaartlagenlijstTab />

          <SelectedTab />

          {openResultTab && <ResultTab />}

          {openSearchedTab && <SearchedTab />}

          <EditPointTabs />
        </div>
      )}
    </>
  );
}
