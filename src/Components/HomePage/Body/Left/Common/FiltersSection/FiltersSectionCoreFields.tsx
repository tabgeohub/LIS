import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useFilterState } from "hooks/zustand/ui/filterState";
import { FilterInput } from "./FilterInput";
import FilterSelect from "./FilterSelect";
import { useContent } from "hooks/useContent";
import { mapRegiosForUserRole } from "./mapRegiosForUserRole";

export function FiltersSectionCoreFields(props: { userRole: string }) {
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");
  const regios = useConstSelectOptions("regios");
  const c = useContent().layout.filterSection;
  const f = useFilterState();
  return (
    <>
      <FilterInput label={c.naamAandachtspunt} value={f.naamAandachtspunt} setValue={f.setNaamAandachtspunt} />
      <FilterSelect label={c.regio} value={f.regio} setValue={f.setRegio} options={mapRegiosForUserRole(regios, props.userRole)} />
      <FilterSelect label={c.activiteit} value={f.activiteit} setValue={f.setActiviteit} options={activities} />
      <FilterSelect label={c.organisatie} value={f.organisatie} setValue={f.setOrganisatie} options={organizations} />
    </>
  );
}
