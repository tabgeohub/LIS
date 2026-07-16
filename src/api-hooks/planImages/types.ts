export type PointPlanImageRow = {
  id: number;
  url: string;
  point_id: number;
  attachmentid: number | null;
  taken_at: string | null;
  location: string | null;
  plan_id: number;
};
