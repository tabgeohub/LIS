import axios from "axios";
import { useEffect, useState } from "react";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { PointPlanImageRow } from "./types";

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

    const resolveLoadError = (error: unknown): string => {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.message
      ) {
        return String((error.response.data as { message?: string }).message);
      }
      return "Afbeeldingen laden mislukt.";
    };

    const isCanceled = (error: unknown): boolean =>
      axios.isAxiosError(error) && error.code === "ERR_CANCELED";

    const loadImages = async () => {
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
      } catch (error: unknown) {
        if (isCanceled(error)) return;
        setImages([]);
        setError(resolveLoadError(error));
      } finally {
        setLoading(false);
      }
    };

    void loadImages();
    return () => controller.abort();
  }, [
    input.enabled,
    input.entityId,
    input.endpoint,
    input.entityParamKey,
    planKey,
    input.regioId,
  ]);

  return { images, loading, error };
}
