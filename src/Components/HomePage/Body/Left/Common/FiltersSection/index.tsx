/* eslint-disable react-hooks/exhaustive-deps */
import TabHeader from "../TabHeader";
import PeriodeComp from "./PeriodeComp";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useFilterState } from "@helpers/ZustandStates/filterState";
import { FilterInput } from "./FilterInput";
import FilterSelect from "./FilterSelect";
import useGetRegios from "hooks/consts/useGetRegios";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { usePointsStore } from "hooks/features/usePointsStore";

export default function FiltersSection() {
  const { setSelectedTab } = useTabState();
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();
  const { dbPoints, setPoints, fetchPoints } = usePointsStore();

  const {
    naamAandachtspunt,
    setNaamAandachtspunt,
    activiteit,
    setActiviteit,
    organisatie,
    setOrganisatie,
    van,
    setVan,
    tot,
    setTot,
    herhalen,
    setHerhalen,
    regio,
    setRegio,
  } = useFilterState();

  const regios = useGetRegios();

  const content = useContent();

  const { user } = useAuth();

  useEffect(() => {
    if (!user.role || user.role === "admin") return setRegio("");

    setRegio(user.role);
  }, [user.role]);

  function resetFilters() {
    setNaamAandachtspunt("");
    setActiviteit("");
    setOrganisatie("");
    setVan("");
    setTot("");
    setHerhalen("");

    setPoints(dbPoints);

    setSelectedTab("none");
  }

  const regiosType = () => {
    const userRole = user.role;

    const userType = userRole.split(" ")[0];

    if (userType === "EXT") {
      return regios.map((regio) => ({
        label: regio.label.replace("RWS ", "EXT "),
        value: regio.value.replace("RWS ", "EXT "),
      }));
    } else {
      return regios;
    }
  };

  return (
    <>
      <TabHeader />

      <div className="px-1 py-4 h-full">
        <p className="text-[12px]">{content.layout.filterSection.text}</p>

        <div className="max-h-[90%] px-1 overflow-y-auto thin-scrollbar">
          <div className="mt-5 space-y-3">
            <FilterInput
              label={content.layout.filterSection.naamAandachtspunt}
              value={naamAandachtspunt}
              setValue={setNaamAandachtspunt}
            />

            <FilterSelect
              label={content.layout.filterSection.regio}
              value={regio}
              setValue={setRegio}
              options={regiosType()}
            />

            <FilterSelect
              label={content.layout.filterSection.activiteit}
              value={activiteit}
              setValue={setActiviteit}
              options={activities}
            />

            <FilterSelect
              label={content.layout.filterSection.organisatie}
              value={organisatie}
              setValue={setOrganisatie}
              options={organizations}
            />

            <PeriodeComp van={van} setVan={setVan} tot={tot} setTot={setTot} />

            <FilterSelect
              label={content.layout.filterSection.herhalen}
              value={herhalen}
              setValue={setHerhalen}
              options={[
                {
                  label: content.layout.filterSection.geenHerhaling,
                  value: "0",
                },
                {
                  label: content.layout.filterSection.metHerhaling,
                  value: "1",
                },
              ]}
            />
          </div>

          <div className="flex justify-end gap-x-1 text-[12px] mt-6">
            <button
              onClick={() => {
                fetchPoints({
                  naamAandachtspunt,
                  activiteit,
                  organisatie,
                  van,
                  tot,
                  herhalen,
                  regio,
                });
              }}
              className="gray-button"
            >
              {content.common.filteren}
            </button>

            <button onClick={resetFilters} className="gray-button">
              {content.common.annuleren}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
