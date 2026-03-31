import { useEffect, useState } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { PointPlanImageRow } from "./usePointPlanImages";

type ApiResponse = {
  geometry_id: number;
  plan_ids: number[];
  images: PointPlanImageRow[];
};

export function useGeometryPlanImages({
  geometryId,
  planIds,
  regioId,
  enabled,
}: {
  geometryId: number;
  planIds: number[];
  regioId: string | undefined;
  enabled: boolean;
}) {
  const [images, setImages] = useState<PointPlanImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planKey = [...planIds].sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!enabled || !geometryId || planIds.length === 0) {
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
          geometry_id: String(geometryId),
          plan_ids: planIds.join(","),
        };
        if (regioId) {
          params.regio_id = regioId;
        }
        const { data } = await axios.get<ApiResponse>(
          `${getBackEndUrl()}/api/timeslider/geometryPlanImages`,
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
  }, [enabled, geometryId, planKey, regioId]);

  return { images, loading, error };
}
