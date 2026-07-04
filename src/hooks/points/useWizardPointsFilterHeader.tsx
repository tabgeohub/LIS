import { ReactNode, useEffect, useMemo, useState } from "react";

export function useWizardPointsFilterHeader(input: {
  points: { omschrijving?: string | null }[];
  step?: number;
  hideHeader?: boolean;
  introText?: string;
}) {
  const [filterText, setFilterText] = useState("");
  const [searchedPoints, setSearchedPoints] = useState(input.points);

  useEffect(() => {
    const q = filterText.trim().toLowerCase();
    setSearchedPoints(
      q
        ? input.points.filter((p) =>
            (p.omschrijving ?? "").toLowerCase().includes(q)
          )
        : input.points
    );
  }, [filterText, input.points]);

  const header = useMemo((): ReactNode => {
    if (input.hideHeader) return null;
    return (
      <>
        {input.introText ? (
          <p className="text-gray-800 leading-3 text-[10px] p-3">{input.introText}</p>
        ) : null}
        <input
          type="text"
          placeholder="Filter resultaten"
          className="inputClass !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </>
    );
  }, [filterText, input.hideHeader, input.introText]);

  return { searchedPoints, header };
}
