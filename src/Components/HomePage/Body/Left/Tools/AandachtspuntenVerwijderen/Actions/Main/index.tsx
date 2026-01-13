import { useState } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SinglePoint from "./SinglePoint";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { useContent } from "hooks/useContent";

export default function Main() {
  const { points } = usePointsStore();

  const [filterTerm, setFilterTerm] = useState("");

  const content = useContent();

  return (
    <>
      <Header setFilterTerm={setFilterTerm} />

      <ScrollButtonsLayout className="h-[75%]" buttons={<Buttons />}>
        <div className="pb-40">
          {points?.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-gray-400 text-[12px]">
                {content.tools.aandachtspuntenVerwijderen.pointsList.noPoints}{" "}
              </p>
            </div>
          )}

          {points
            .filter((point) =>
              point.omschrijving
                .toLowerCase()
                .includes(filterTerm.toLowerCase())
            )
            .map((point) => (
              <SinglePoint key={point.id} point={point} />
            ))}
        </div>
      </ScrollButtonsLayout>
    </>
  );
}
