import { useEffect, useState } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { PointPlanImageRow } from "./planImageTypes";

type EntityPlanImagesInput = {
  endpoint: string;
  entityParamKey: string;
  entityId: number;
  planIds: number[];
  regioId: string | undefined;
  enabled: boolean;
};

export function useEntityPlanImages(input: EntityPlanImagesInput) {
  const [images, setImages] = useState<PointPlanImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planKey = [...input.planIds].sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!input.enabled || !input.entityId || input.planIds.length === 0) {
      if (!input.enabled) setLoading(false);
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);
      setImages([]);

      try {
        const params: Record<string, string> = {
          [input.entityParamKey]: String(input.entityId),
          plan_ids: input.planIds.join(","),
        };
        if (input.regioId) params.regio_id = input.regioId;

        const { data } = await axios.get<{ images?: PointPlanImageRow[] }>(
          `${getBackEndUrl()}${input.endpoint}`,
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
  }, [input.enabled, input.entityId, input.endpoint, input.entityParamKey, planKey, input.regioId]);

  return { images, loading, error };
}
