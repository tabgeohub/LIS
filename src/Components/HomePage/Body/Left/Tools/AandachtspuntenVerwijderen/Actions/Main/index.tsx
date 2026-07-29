import { useState, useMemo } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useDeletePointState } from "Components/HomePage/hooks/zustand/tools/useDeletePointState";
import { sortPointsWithSelectedFirst } from "./sortDeletePoints";
import { useDeletePointMapSelection } from "./useDeletePointMapSelection";
import { DeletePointsList } from "./DeletePointsList";

export default function Main() {
  const { points } = usePointsStore();
  const { selectedPoints } = useDeletePointState();
  const [filterTerm, setFilterTerm] = useState("");
  useDeletePointMapSelection();

  const sortedPoints = useMemo(
    () =>
      sortPointsWithSelectedFirst({
        points,
        filterTerm,
        selectedPoints,
      }),
    [points, filterTerm, selectedPoints]
  );

  return (
    <>
      <Header setFilterTerm={setFilterTerm} />
      <ScrollButtonsLayout className="h-[75%]" buttons={<Buttons />}>
        <DeletePointsList
          pointsLength={points?.length ?? 0}
          sortedPoints={sortedPoints}
        />
      </ScrollButtonsLayout>
    </>
  );
}
