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

function resolveLoadError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return String((error.response.data as { message?: string }).message);
  }
  return "Afbeeldingen laden mislukt.";
}

function isCanceled(error: unknown): boolean {
  return axios.isAxiosError(error) && error.code === "ERR_CANCELED";
}

function buildImageQueryParams(input: EntityPlanImagesInput): Record<string, string> {
  const params: Record<string, string> = {
    [input.entityParamKey]: String(input.entityId),
    plan_ids: input.planIds.join(","),
  };
  if (input.regioId) params.regio_id = input.regioId;
  return params;
}

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

    const applyLoadFailure = (error: unknown) => {
      if (isCanceled(error)) return;
      setImages([]);
      setError(resolveLoadError(error));
    };

    const loadImages = async () => {
      setLoading(true);
      setError(null);
      setImages([]);

      try {
        const { data } = await axios.get<{ images?: PointPlanImageRow[] }>(
          `${getBackEndUrl()}${input.endpoint}`,
          { params: buildImageQueryParams(input), signal: controller.signal }
        );
        setImages(data.images ?? []);
      } catch (error: unknown) {
        applyLoadFailure(error);
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
