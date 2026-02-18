import { classNames } from "@helpers/classNames";
import { useFilterState } from "@helpers/ZustandStates/filterState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useContent } from "hooks/useContent";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { IoReloadCircle } from "react-icons/io5";
import { TbFilterQuestion } from "react-icons/tb";

export default function FilterTabs() {
  const { selectedTab, setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { user } = useAuth();
  const { resetFeatures } = useResetFeatures();

  const {
    setNaamAandachtspunt,
    setActiviteit,
    setOrganisatie,
    setVan,
    setTot,
    setHerhalen,
  } = useFilterState();

  function resetFilters() {
    setNaamAandachtspunt("");
    setActiviteit("");
    setOrganisatie("");
    setVan("");
    setTot("");
    setHerhalen("");

    resetFeatures();

    setSelectedTab("none");
  }

  const content = useContent();

  return (
    <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between max-h-[120px]">
      <div className="flex gap-[10px] pt-2">
        <div
          onClick={() => {
            if (user.user_id !== 0) {
              setSelectedTab("aandachtspuntenFilteren");
              setOpenSideBar(true);
            }
          }}
          className={classNames(
            "text-center py-2 grid grid-rows-2 text-gray-400 group border-2 transition-all duration-300 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer",
            selectedTab === "aandachtspuntenFilteren"
              ? "border-blue-200 bg-blue-50"
              : "border-transparent"
          )}
        >
          <button className="border-none rounded-md transition duration-100 text-primary">
            <TbFilterQuestion className="size-5 mx-auto" />
          </button>
          <p className="text-[11px] tracking-normal w-[90px]">
            {content.layout.filterSection.filterBtnTab}
          </p>
        </div>

        <div
          className="text-center grid grid-rows-2 border-transparent py-2 text-primary group border-2 transition-all duration-300 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
          onClick={resetFilters}
        >
          <button className="border-none rounded-md transition duration-100 text-primary">
            <IoReloadCircle className="size-5 mx-auto" />
          </button>
          <p className="text-[11px] tracking-normal w-[90px]">
            {content.layout.filterSection.resetBtnTab}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 tracking-normal text-center">
        {content.layout.filterSection.filterText}
      </p>
    </div>
  );
}
