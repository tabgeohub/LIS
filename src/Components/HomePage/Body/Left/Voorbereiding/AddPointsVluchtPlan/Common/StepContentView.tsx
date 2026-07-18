import Filter from "../Common/Filter";
import StepContentLists from "./StepContentLists";
import type { StepContentViewProps } from "./stepContentViewProps";

export function StepContentView(p: StepContentViewProps) {
  if (p.openFilter) {
    return (
      <div className="p-1.5 h-full">
        <Filter
          herhalen={p.herhalen}
          setOpenFilter={p.setOpenFilter}
          setFilteredPoints={p.setFilteredPoints}
        />
      </div>
    );
  }
  const { openFilter: _o, setOpenFilter: _s, setFilteredPoints: _f, ...lists } =
    p;
  return (
    <div className="p-1.5 h-full">
      <StepContentLists {...lists} />
    </div>
  );
}
