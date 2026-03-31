import { useEffect, useState } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

export type PointPlanImageRow = {
  id: number;
  url: string;
  point_id: number;
  attachmentid: number | null;
  taken_at: string | null;
  location: string | null;
  plan_id: number;
};

type ApiResponse = {
  point_id: number;
  plan_ids: number[];
  images: PointPlanImageRow[];
};

export function usePointPlanImages({
  pointId,
  planIds,
  regioId,
  enabled,
}: {
  pointId: number;
  planIds: number[];
  regioId: string | undefined;
  enabled: boolean;
}) {
  const [images, setImages] = useState<PointPlanImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planKey = [...planIds].sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!enabled || !pointId || planIds.length === 0) {
      if (!enabled) {
        setLoading(false);
      }
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);
      setImages([]);
      try {
        const params: Record<string, string> = {
          point_id: String(pointId),
          plan_ids: planIds.join(","),
        };
        if (regioId) {
          params.regio_id = regioId;
        }
        const { data } = await axios.get<ApiResponse>(
          `${getBackEndUrl()}/api/timeslider/pointPlanImages`,
          { params, signal: controller.signal }
        );
        setImages(data.images ?? []);
      } catch (e: unknown) {
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        setImages([]);
        setError(
          axios.isAxiosError(e) && e.response?.data?.message
            ? String((e.response.data as { message?: string }).message)
            : "Afbeeldingen laden mislukt."
        );
      } finally {
        setLoading(false);
      }
    };

    void run();

    return () => controller.abort();
  }, [enabled, pointId, planKey, regioId]);

  return { images, loading, error };
}
