/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { applyDuplicatedPlanFields } from "./applyDuplicatedPlanFields";

export function useHydrateDuplicateFlightPlanForm(store: {
  duplicatedFlightPlan: Parameters<typeof applyDuplicatedPlanFields>[1] | null;
  setAanmaker: (v: string) => void;
  setAanmaaldatum: (v: string) => void;
  setOmschrijving: (v: string) => void;
  setWaarnemer: (v: string) => void;
  setPiloot: (v: string) => void;
  setGeplandeVliegduur: (v: any) => void;
  setTypeLuchtvaartuig: (v: string) => void;
  setAantalPassagiers: (v: any) => void;
  setDoelEnHoofdthema: (v: string) => void;
  setAanvullendeInfo: (v: string) => void;
  setBasemap: (v: string) => void;
  setLayers: (v: any) => void;
}) {
  const { duplicatedFlightPlan } = store;
  useEffect(() => {
    if (!duplicatedFlightPlan) return;
    applyDuplicatedPlanFields(store, duplicatedFlightPlan);
  }, [duplicatedFlightPlan]);
}
