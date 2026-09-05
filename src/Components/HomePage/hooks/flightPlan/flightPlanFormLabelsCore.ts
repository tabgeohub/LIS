import type { Content } from "hooks/useContent";
import type { FlightPlanFieldLabels } from "Components/Common/FlightPlanForm/flightPlanStandardSelectProps";

export function nabewerkingVluchtenZoekenFieldLabels(
  content: Content
): FlightPlanFieldLabels {
  const labels = content.nabewerking.vluchtenZoeken.step2.labels;
  return {
    omschrijving: labels.omschrijving,
    waarnemer: labels.waarnemer,
    piloot: labels.piloot,
    datum: labels.inspectiedatum,
    geplandeVliegduur: labels.geplandeVliegduur,
    typeLuchtvaartuig: labels.luchtvaartuig,
    aantalPassagiers: labels.aantalPassagiers,
    doelEnHoofdthema: labels.doelEnHoofdthema,
    aanvullendeInfo: labels.aanvullendeInfo,
  };
}

export function voorbereidingVluchtAanmakenFieldLabels(
  content: Content
): FlightPlanFieldLabels {
  const step = content.voorbereiding.vluchtAanmaken.step1;
  return {
    omschrijving: step.omschrijving,
    waarnemer: step.waarnemer,
    piloot: step.piloot,
    datum: step.datum,
    geplandeVliegduur: step.geplandeVliegduur,
    typeLuchtvaartuig: step.typeLuchtvaartuig,
    aantalPassagiers: step.aantalPassagiers,
    doelEnHoofdthema: step.doelEnHoofdthema,
    aanvullendeInfo: step.aanvullendeInfo,
  };
}
