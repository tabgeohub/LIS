export interface PointData {
  id?: number;
  longitude?: number;
  latitude?: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
  omschrijving?: string;
  [key: string]: any;
}

export interface PointSymbolOptions {
  color?: string | [number, number, number, number];
  size?: number;
  style?: "circle" | "square" | "cross" | "x" | "diamond" | "triangle";
  outlineColor?: string | [number, number, number, number];
  outlineWidth?: number;
}

export interface CreatePointGraphicOptions {
  symbolOptions?: PointSymbolOptions;
  attributes?: Record<string, any>;
  transformCoordinates?: boolean;
}
