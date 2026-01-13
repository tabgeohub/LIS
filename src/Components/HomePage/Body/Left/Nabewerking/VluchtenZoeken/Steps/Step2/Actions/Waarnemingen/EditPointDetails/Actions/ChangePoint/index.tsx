/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Header from "./Header";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import SinglePoint from "./SinglePoints";
import { EnrichedPointType } from "Types";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import Buttons from "./Buttons";
import Filter from "./Filter";
import { useUpdateData } from "utils/useUpdateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";

export default function ChangePoint({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const logAction = useLogAction();

  const [filterTerm, setFilterTerm] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const { selectedPoint } = useFinishedPlansState();

  const [newSelectedPoint, setNewSelectedPoint] =
    useState<EnrichedPointType | null>(null);

  const { points, setPoints, dbPoints } = usePointsStore();

  useEffect(() => {
    setPoints(dbPoints);
  }, []);

  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  function handleSubmit() {
    if (!newSelectedPoint || !selectedPoint) return;

    const newUpdatedPoint = {
      omschrijving: newSelectedPoint.omschrijving,
      regio_id: selectedPoint.regio_id,
      xcoordinaat_rd: newSelectedPoint.xcoordinaat_rd,
      ycoordinaat_rd: newSelectedPoint.ycoordinaat_rd,
      latitude: newSelectedPoint.latitude,
      longitude: newSelectedPoint.longitude,
      vertrouwelijk: newSelectedPoint.vertrouwelijk,
      herhalen: selectedPoint.herhalen,
      user_id: selectedPoint.user_id,
      activiteit_id: newSelectedPoint.activiteit_id,
      organisatie_id: newSelectedPoint.organisatie_id,
      specifiek_letten_op: newSelectedPoint.specifiek_letten_op,
      datum: selectedPoint.datum,
      id: selectedPoint.id,
    };

    update(newUpdatedPoint, (responseData) => {
      if (!responseData.result) return;

      setPoints(dbPoints);
      setAction("form");
    });

    logAction({
      message: "User clicked 'Submit' button to change point",
      step: "Second step - Change point",
      newData: {
        ...newUpdatedPoint,
      },
    });
  }

  return (
    <>
      {!openFilter && (
        <div className="h-[62vh] overflow-hidden relative">
          <Header setFilterTerm={setFilterTerm} />

          <div className="h-[45vh] overflow-y-auto divide-y-2 thin-scrollbar">
            {points
              .filter((point) =>
                point.omschrijving
                  .toLowerCase()
                  .includes(filterTerm.toLowerCase())
              )
              .map((point) => (
                <div>
                  <SinglePoint
                    selectedPoint={newSelectedPoint!}
                    setSelectedPoint={setNewSelectedPoint}
                    point={point}
                    key={point.id}
                  />
                </div>
              ))}
          </div>

          <Buttons
            setOpenFilter={setOpenFilter}
            setAction={setAction}
            handleSubmit={handleSubmit}
          />

          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-500/20 bg-opacity-50 z-10">
              <LoadingBars />
            </div>
          )}
        </div>
      )}

      {openFilter && <Filter />}
    </>
  );
}
