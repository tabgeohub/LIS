import { ReactNode, useEffect, useMemo, useState } from "react";

function filterPointsByText<T extends { omschrijving?: string | null }>(
  points: T[],
  filterText: string
): T[] {
  const q = filterText.trim().toLowerCase();
  if (!q) return points;
  return points.filter((p) => (p.omschrijving ?? "").toLowerCase().includes(q));
}

function renderFilterHeader(input: {
  hideHeader?: boolean;
  introText?: string;
  filterText: string;
  setFilterText: (value: string) => void;
}): ReactNode {
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
        value={input.filterText}
        onChange={(e) => input.setFilterText(e.target.value)}
      />
    </>
  );
}

export function useWizardPointsFilterHeader<
  T extends { omschrijving?: string | null }
>(input: {
  points: T[];
  step?: number;
  hideHeader?: boolean;
  introText?: string;
}) {
  const [filterText, setFilterText] = useState("");
  const [searchedPoints, setSearchedPoints] = useState(input.points);

  useEffect(() => {
    setSearchedPoints(filterPointsByText(input.points, filterText));
  }, [filterText, input.points]);

  const header = useMemo(
    (): ReactNode =>
      renderFilterHeader({
        hideHeader: input.hideHeader,
        introText: input.introText,
        filterText,
        setFilterText,
      }),
    [filterText, input.hideHeader, input.introText]
  );

  return { searchedPoints, header };
}
