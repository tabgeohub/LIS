import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import type { TemplateSelectionBodyProps } from "./templateSelectionBodyProps";
import { TemplateSelectionLists } from "./TemplateSelectionLists";

export function TemplateSelectionStepBody(p: TemplateSelectionBodyProps) {
  return (
    <ScrollButtonsLayout className="h-[100%]" buttons={p.buttons}>
      <p className="text-gray-800 leading-3 text-[10px] p-3">{p.text}</p>
      <input
        type="text"
        placeholder="Filter resultaten"
        className="inputClass !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
        value={p.filterText}
        onChange={(e) => p.setFilterText(e.target.value)}
      />
      <TemplateSelectionLists {...p} />
    </ScrollButtonsLayout>
  );
}
