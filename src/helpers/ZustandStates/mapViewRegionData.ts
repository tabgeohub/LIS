export interface RegionData {
  [key: string]: {
    [attr: string]: any;
    rings: number[][][];
  }[];
}
