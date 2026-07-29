import PeriodeComp from "./PeriodeComp";
import { useFilterState } from "hooks/zustand/ui/filterState";
import FilterSelect from "./FilterSelect";
import { useContent } from "hooks/useContent";
import { FiltersSectionCoreFields } from "./FiltersSectionCoreFields";

export function FiltersSectionFields(props: { userRole: string }) {
  const content = useContent();
  const f = useFilterState();

  return (
    <div className="mt-5 space-y-3">
      <FiltersSectionCoreFields userRole={props.userRole} />
      <PeriodeComp van={f.van} setVan={f.setVan} tot={f.tot} setTot={f.setTot} />
      <FilterSelect
        label={content.layout.filterSection.herhalen}
        value={f.herhalen}
        setValue={f.setHerhalen}
        options={[
          { label: content.layout.filterSection.geenHerhaling, value: "0" },
          { label: content.layout.filterSection.metHerhaling, value: "1" },
        ]}
      />
    </div>
  );
}
