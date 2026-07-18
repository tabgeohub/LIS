import type { FlightPlanType } from "Types";

type FormSetters = {
  setAanmaker: (v: string) => void;
  setAanmaaldatum: (v: string) => void;
  setOmschrijving: (v: string) => void;
  setWaarnemer: (v: string) => void;
  setPiloot: (v: string) => void;
  setGeplandeVliegduur: (v: string | number) => void;
  setTypeLuchtvaartuig: (v: string) => void;
  setAantalPassagiers: (v: string | number) => void;
  setDoelEnHoofdthema: (v: string) => void;
  setAanvullendeInfo: (v: string) => void;
  setBasemap: (v: string) => void;
  setLayers: (v: unknown) => void;
};

export function applyDuplicatedPlanFields(
  store: FormSetters,
  plan: FlightPlanType
) {
  store.setAanmaker(String(plan.user_id));
  store.setAanmaaldatum(plan.datum);
  store.setOmschrijving(plan.omschrijving);
  store.setWaarnemer(plan.waarnemer);
  store.setPiloot(plan.piloot);
  store.setGeplandeVliegduur(plan.geplandeVliegduur);
  store.setTypeLuchtvaartuig(plan.typeLuchtvaartuig);
  store.setAantalPassagiers(plan.passagiers);
  store.setDoelEnHoofdthema(plan.hoofdthema);
  store.setAanvullendeInfo(plan.aanvullende);
  store.setBasemap(plan.basemap);
  store.setLayers(plan.layers);
}
