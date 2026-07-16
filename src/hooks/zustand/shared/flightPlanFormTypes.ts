export type FlightPlanFormFieldValues = {
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  geplandeVliegduur: string;
  typeLuchtvaartuig: string;
  aantalPassagiers: number | null | undefined;
  doelEnHoofdthema: string;
  aanvullendeInfo: string;
};

export type FlightPlanFormFieldSetters = {
  setOmschrijving: (value: string) => void;
  setWaarnemer: (value: string) => void;
  setPiloot: (value: string) => void;
  setDatum: (value: string) => void;
  setGeplandeVliegduur: (value: string) => void;
  setTypeLuchtvaartuig: (value: string) => void;
  setAantalPassagiers: (value: number | null | undefined) => void;
  setDoelEnHoofdthema: (value: string) => void;
  setAanvullendeInfo: (value: string) => void;
};
