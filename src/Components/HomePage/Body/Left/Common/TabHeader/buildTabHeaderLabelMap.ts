import type { TabType } from "Types";

type TabHeaderContent = {
  layout: {
    tabHeaders: Record<string, string>;
    pages: Array<string | undefined>;
  };
};

export function buildTabHeaderLabelMap(
  content: TabHeaderContent
): Partial<Record<TabType, string | undefined>> {
  const h = content.layout.tabHeaders;
  return {
    addPoint: h.addPoint,
    enrichedAddPoint: h.enrichedAddPoint,
    templateFlights: h.templateFlights,
    flightPlan: h.flightPlan,
    viewPlan: h.viewPlan,
    prepareFlightPlan: h.prepareFlightPlan,
    removeFlightPlan: h.removeFlightPlan,
    aandachtspuntenFilteren: h.aandachtspuntenFilteren,
    bevragen: h.bevragen,
    vluchtZoeken: h.vluchtZoeken,
    timeslider: content.layout.pages.at(3),
    reuseFlightPlan: h.reuseFlightPlan,
    waarnemings: h.waarnemings,
    vluchtplanStatus: h.vluchtplanStatus,
    verwijderen: h.verwijderen,
    emailijst: h.emailijst,
    tekengereedschap: h.tekengereedschap,
    editGeometry: h.editGeometry,
  };
}
