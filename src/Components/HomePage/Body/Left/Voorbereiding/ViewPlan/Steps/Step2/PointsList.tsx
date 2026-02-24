import { useOpenTable } from "@helpers/ZustandStates/showTable";
import useLogAction from "hooks/useLogAction";
import { TbPolygon, TbLine } from "react-icons/tb";

export default function PointsList({
  clickedPoint,
  clickedGeometry,
  selectTargetPoint,
  selectTargetGeometry,
}: {
  clickedPoint: number;
  clickedGeometry: number | null;
  selectTargetPoint: (index: number) => void;
  selectTargetGeometry: (geometryId: number) => void;
}) {
  const logAction = useLogAction();

  const { pointsTable, geometriesTable } = useOpenTable();

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
              className={`${clickedPoint === index && "bg-gray-200"
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

      {geometriesTable && geometriesTable.length > 0 && (
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-500 font-semibold">Geometrieën</p>
          <div className="w-[60%] h-[10vh] overflow-y-scroll border-[1px]">
            {geometriesTable.map((geometry, index: number) => (
              <div
                key={geometry.id}
                className={`flex items-center gap-x-2 w-[100%] text-[12px] font-semibold px-2 py-1 hover:bg-gray-100 cursor-pointer ${clickedGeometry === geometry.id ? "bg-gray-200" : ""
                  }`}
                onClick={() => {
                  selectTargetGeometry(geometry.id);

                  logAction({
                    message: "User clicked a geometry",
                    step: "View plan - Step 2",
                    newData: {
                      omschrijving: geometry.omschrijving,
                      geometryId: geometry.id,
                    },
                  });
                }}
              >
                {geometry.type === "polygon" ? (
                  <TbPolygon className="size-4 text-yellow-500" />
                ) : (
                  <TbLine className="size-4 text-green-500" />
                )}
                <p>{geometry.omschrijving || `Geometrie ${geometry.id}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
