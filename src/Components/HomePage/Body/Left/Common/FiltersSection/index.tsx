/* eslint-disable react-hooks/exhaustive-deps */
import TabHeader from "../TabHeader";
import { useFilterState } from "hooks/zustand/ui";
import { useContent } from "hooks/useContent";
import { useEffect } from "react";
import { useAuth } from "hooks/zustand/ui";
import { FiltersSectionFields } from "./FiltersSectionFields";
import { FiltersSectionActions } from "./FiltersSectionActions";

export default function FiltersSection() {
  const { setRegio } = useFilterState();
  const content = useContent();
  const { user } = useAuth();

  useEffect(() => {
    if (!user.role || user.role === "admin") return setRegio("");
    setRegio(user.role);
  }, [user.role]);

  return (
    <>
      <TabHeader />
      <div className="px-1 py-4 h-full">
        <p className="text-[12px]">{content.layout.filterSection.text}</p>
        <div className="max-h-[90%] px-1 overflow-y-auto thin-scrollbar">
          <FiltersSectionFields userRole={user.role ?? ""} />
          <FiltersSectionActions />
        </div>
      </div>
    </>
  );
}
