/** Shared aandachtspunt detail field values + setters (forms and drawing store). */
export type AandachtspuntDetailsValues = {
  vertrouwelijk: boolean;
  setVertrouwelijk: (value: boolean) => void;
  herhalen: boolean;
  setHerhalen: (value: boolean) => void;
  activiteit: string;
  setActiviteit: (value: string) => void;
  organisatie: string;
  setOrganisatie: (value: string) => void;
  specifiekLettenOp: string;
  setSpecifiekLettenOp: (value: string) => void;
};

export type AandachtspuntDetailsFieldState = Pick<
  AandachtspuntDetailsValues,
  | "vertrouwelijk"
  | "herhalen"
  | "activiteit"
  | "organisatie"
  | "specifiekLettenOp"
>;
