import { useState } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import DropDown from "./DropDown";
import { FlightPlanType } from "Types";

export default function Header({
  flightPlan,
  setFlightPlanDetails,
}: {
  flightPlan: FlightPlanType;
  setFlightPlanDetails: (value: boolean) => void;
}) {
  const [openDropDown, setOpenDropDown] = useState(false);

  return (
    <div className="relative flex justify-center border-b-[1px] border-gray-100 py-2">
      <p className="text-gray-500 text-sm">{flightPlan?.vluchtnummer}</p>

      <div className="gap-x-2 absolute right-2 top-1">
        <button
          onClick={() => setOpenDropDown(!openDropDown)}
          className="bg-transparent text-gray-500 text-lg font-bold mr-2"
        >
          <BsTextParagraph className="mt-2" />
        </button>
      </div>

      <div className="gap-x-2 absolute left-2 top-1">
        <button className="bg-transparent text-gray-500 text-lg font-bold">
          <IoIosArrowBack
            className="mt-2"
            onClick={() => setFlightPlanDetails(false)}
          />
        </button>
      </div>

      {openDropDown && <DropDown flightPlan={flightPlan} />}
    </div>
  );
}
