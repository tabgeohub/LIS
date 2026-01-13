import { create } from "zustand";

export const useFilterState = create<{
  naamAandachtspunt: string;
  setNaamAandachtspunt: (value: string) => void;

  activiteit: string;
  setActiviteit: (value: string) => void;

  organisatie: string;
  setOrganisatie: (value: string) => void;

  regio: string;
  setRegio: (value: string) => void;

  van: string;
  setVan: (value: string) => void;

  tot: string;
  setTot: (value: string) => void;

  herhalen: string;
  setHerhalen: (value: string) => void;

  vertrouwelijk: string;
  setVertrouwelijk: (value: string) => void;
}>((set) => ({
  naamAandachtspunt: "",
  setNaamAandachtspunt: (naamAandachtspunt: string) =>
    set({ naamAandachtspunt }),

  activiteit: "",
  setActiviteit: (activiteit: string) => set({ activiteit }),

  organisatie: "",
  setOrganisatie: (organisatie: string) => set({ organisatie }),

  regio: "",
  setRegio: (regio: string) => set({ regio }),

  van: "",
  setVan: (van: string) => set({ van }),

  tot: "",
  setTot: (tot: string) => set({ tot }),

  herhalen: "",
  setHerhalen: (herhalen: string) => set({ herhalen }),

  vertrouwelijk: "",
  setVertrouwelijk: (vertrouwelijk: string) => set({ vertrouwelijk }),
}));
