import { Geometry } from "hooks/features/useGeometriesStore";

export type TemplatePoint = {
  id: number;
  omschrijving: string;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
  latitude?: number;
  longitude?: number;
};

export type Template = {
  id: number;
  name: string;
  points: TemplatePoint[];
  geometries?: Geometry[];
};
