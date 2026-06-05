interface GeometryPoint {
  id: number;
  longitude: number;
  latitude: number;
  [key: string]: any;
}

export interface Geometry {
  id: number;
  omschrijving: string;
  type: "polygon" | "line";
  points: GeometryPoint[];
  organisatie?: string;
  vertrouwelijk?: boolean | number;
  herhalen?: boolean | number;
  activiteit?: string;
  specifiek_letten_op?: string;
  regio_id?: string;
  [key: string]: any;
}
