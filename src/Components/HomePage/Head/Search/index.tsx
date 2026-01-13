import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useSearchKeyword } from "@helpers/ZustandStates/searchKeyword";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import useLogAction from "hooks/useLogAction";
import { FiSearch } from "react-icons/fi";

export default function Search() {
  const logAction = useLogAction();

  const { searchKeyword, setSearchKeyword } = useSearchKeyword();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  function handleSearch(e) {
    e.preventDefault();
    setSelectedBottomTab("searched");
    setOpenSideBar(true);
    setOpenSearchedTab(true);

    logAction({
      message: "User clicked 'Search' button",
      newData: {
        searchKeyword: searchKeyword,
      },
    });
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Zoeken..."
          className="mt-1 py-1 px-3 pr-10 w-full rounded border border-gray-300"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <FiSearch className="text-gray-500 pointer-events-none" />
        </button>
      </div>
    </form>
  );
}
