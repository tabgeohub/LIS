import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useViewPlanState } from "../Left/Voorbereiding/ViewPlan/helpers/useViewPlanState";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { BsTextParagraph } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";

export default function Head({
  vluchtnummer,
  showTableDiv,
  setShowTableDiv,
}: {
  vluchtnummer: string;
  showTableDiv: boolean;
  setShowTableDiv: (showTableDiv: boolean) => void;
}) {
  const { pointsTable, setPointsTable, setOpenTable, view } = useOpenTable();
  const { setSelectedIndex } = useViewPlanState();
  const { openAllTable, setOpenAllTable } = useOpenAllTable();

  return (
    <div>
      <div className="relative flex items-center justify-center py-2 border-[1px]">
        <h4 className="text-md text-gray-400">
          Aandachtspunten vluchtplan '{vluchtnummer}' ({pointsTable.length})
        </h4>
        <div className="flex gap-x-2">
          <button
            onClick={() => {
              setShowTableDiv(showTableDiv ? false : true);
            }}
            className="bg-transparent text-gray-500 text-lg font-bold absolute right-16 top-[50%] translate-y-[-50%]"
          >
            <BsTextParagraph />
          </button>
          <button
            onClick={() => {
              setOpenAllTable(openAllTable ? false : true);
            }}
            className="bg-transparent text-gray-500 text-lg font-bold absolute right-8 top-[50%] translate-y-[-50%]"
          >
            {openAllTable ? (
              <IoMdArrowDropdown className="text-2xl" />
            ) : (
              <IoMdArrowDropup className="text-2xl" />
            )}
          </button>
          <button
            onClick={() => {
              setOpenTable(false);
              setPointsTable([]);
              setSelectedIndex(0);
            }}
            className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 top-[50%] translate-y-[-50%]"
          >
            <IoClose />
          </button>
        </div>
      </div>

      {view === "points" && <div className="bg-gray-100 w-full h-8" />}
    </div>
  );
}
