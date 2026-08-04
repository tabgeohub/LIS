import dayjs from "dayjs";
import { FaCheckCircle } from "react-icons/fa";
import { FlightPlanType } from "Types";

dayjs.locale("nl");

export function FlightPlanPickerRow(input: {
  plan: FlightPlanType;
  selected: boolean;
  onSelect: () => void;
  showFinishedBadge: boolean;
  additionalInfoLabel: string;
}) {
  return (
    <div
      onClick={input.onSelect}
      className={`text-[14px] px-5 py-1 cursor-pointer transition-all relative ${
        input.selected ? "bg-gray-100" : "hover:bg-blue-100"
      }`}
    >
      {input.showFinishedBadge && input.plan.is_finished && (
        <FaCheckCircle className="absolute top-1 right-1 text-green-500 text-lg" />
      )}

      <div className="flex gap-x-2 items-center font-medium">
        <p>vluchtplan: </p>
        <p>{input.plan.vluchtnummer}</p>
      </div>

      <div className="flex gap-x-2 items-center text-gray-500">
        <p>datum: </p>
        <p className="capitalize">
          {dayjs(input.plan.datum).format("DD MMM YYYY")}
        </p>
      </div>

      <div className="flex gap-x-2 items-center text-gray-500">
        <p>{input.additionalInfoLabel}: </p>
        <p>{input.plan.aanvullende}</p>
      </div>
    </div>
  );
}
