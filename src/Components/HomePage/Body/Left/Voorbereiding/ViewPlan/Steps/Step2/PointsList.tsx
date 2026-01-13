import { useOpenTable } from "@helpers/ZustandStates/showTable";
import useLogAction from "hooks/useLogAction";

export default function PointsList({
  clickedPoint,
  selectTargetPoint,
}: {
  clickedPoint: number;
  selectTargetPoint: (index: number) => void;
}) {
  const logAction = useLogAction();

  const { pointsTable } = useOpenTable();

  return (
    <>
      <h4 className="text-sm font-bold text-black">
        Selecteer een aandachtspunt voor details en eventuele bewerkingen
      </h4>

      <div className="flex justify-between">
        <p className="text-sm text-gray-500 font-semibold">Aandachtspunten</p>
        <div className="w-[60%] h-[10vh] overflow-y-scroll border-[1px]">
          {pointsTable.map((point, index: number) => (
            <p
              key={index}
              className={`${
                clickedPoint === index && "bg-gray-200"
              } w-[100%] text-[12px] font-semibold`}
              onClick={() => {
                selectTargetPoint(index);

                logAction({
                  message: "User clicked a point",
                  step: "View plan - Step 2",
                  newData: {
                    omschrijving: point.omschrijving,
                    pointId: point.id,
                  },
                });
              }}
            >
              {point.omschrijving}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
