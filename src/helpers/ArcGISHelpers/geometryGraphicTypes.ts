export interface GeometryPoint {
  longitude: number;
  latitude: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
}

export interface BaseGeometryData {
  id?: number;
  type?: "polygon" | "line";
  geometry_type?: "polygon" | "line";
  points?: GeometryPoint[];
  omschrijving?: string;
  geometry_omschrijving?: string;
  [key: string]: any;
}

export interface GeometrySymbolOptions {
  fillColor?: [number, number, number, number];
  outlineColor?: [number, number, number, number];
  lineColor?: [number, number, number, number];
  outlineWidth?: number;
  lineWidth?: number;
}

export interface CreateGeometryGraphicOptions {
  symbolOptions?: GeometrySymbolOptions;
  attributes?: Record<string, any>;
  transformCoordinates?: (point: GeometryPoint) => [number, number] | null;
}
