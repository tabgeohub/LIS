import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import {
  filterFinishedPlansContainingItem,
  getItemDisplayTitle,
  sortPlansNewestFirst,
} from "@helpers/timeslider";
import { usePointPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/usePointPlanImages";
import { useGeometryPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/useGeometryPlanImages";
import { pointPlanImagesToAttachments } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/pointPlanImagesToAttachments";

type ParsedQuery =
  | {
      ok: true;
      kind: "point" | "geometry";
      id: number;
      from: string;
      to: string;
      /** Present when opening from a specific list row; scopes images to that plan. */
      planId: number | null;
    }
  | { ok: false; reason: string };

function parseQuery(searchParams: URLSearchParams): ParsedQuery {
  const kind = searchParams.get("kind");
  const idStr = searchParams.get("id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (kind !== "point" && kind !== "geometry") {
    return { ok: false, reason: "Ongeldige link (kind)." };
  }
  const id = idStr != null ? Number(idStr) : NaN;
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, reason: "Ongeldige link (id)." };
  }
  if (
    !from ||
    !to ||
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to)
  ) {
    return { ok: false, reason: "Ongeldige link (periode)." };
  }
  const planIdStr = searchParams.get("plan_id");
  let planId: number | null = null;
  if (planIdStr != null && planIdStr !== "") {
    const pid = Number(planIdStr);
    if (!Number.isFinite(pid) || pid <= 0) {
      return { ok: false, reason: "Ongeldige link (plan_id)." };
    }
    planId = pid;
  }
  return { ok: true, kind, id, from, to, planId };
}

export function useTimesliderImagePageData() {
  const [searchParams] = useSearchParams();
  const parsed = useMemo(() => parseQuery(searchParams), [searchParams]);
  const { user } = useAuth();

  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [allPlans, setAllPlans] = useState<FinishedFlightPlanType[]>([]);

  const ok = parsed.ok;
  const from = ok ? parsed.from : "";
  const to = ok ? parsed.to : "";
  const itemId = ok ? parsed.id : 0;
  const kind = ok ? parsed.kind : "point";
  const planIdFromQuery = ok ? parsed.planId : null;

  useEffect(() => {
    if (!ok || !user?.role) {
      setAllPlans([]);
      setPlansError(null);
      setPlansLoading(false);
      return;
    }
    const controller = new AbortController();
    setPlansLoading(true);
    setPlansError(null);
    axios
      .get<FinishedFlightPlanType[]>(
        `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
        {
          params: { regio_id: user.role, from, to },
          signal: controller.signal,
        }
      )
      .then((res) => setAllPlans(sortPlansNewestFirst(res.data || [])))
      .catch((e) => {
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        setAllPlans([]);
        setPlansError("Plannen laden mislukt.");
      })
      .finally(() => setPlansLoading(false));

    return () => controller.abort();
  }, [ok, from, to, user?.role]);

  const filteredPlans = useMemo(
    () =>
      ok ? filterFinishedPlansContainingItem(allPlans, kind, itemId) : [],
    [allPlans, ok, kind, itemId]
  );

  const planIds = useMemo(() => {
    const ids = filteredPlans.map((p) => p.id);
    if (planIdFromQuery == null) return ids;
    if (ids.includes(planIdFromQuery)) return [planIdFromQuery];
    return ids;
  }, [filteredPlans, planIdFromQuery]);

  const displayTitle = useMemo(
    () =>
      ok
        ? getItemDisplayTitle(
            filteredPlans.length ? filteredPlans : allPlans,
            kind,
            itemId
          )
        : "",
    [ok, filteredPlans, allPlans, kind, itemId]
  );

  const regioId = user?.role;
  const enabledPoint =
    ok && kind === "point" && !!regioId && planIds.length > 0;
  const enabledGeometry =
    ok && kind === "geometry" && !!regioId && planIds.length > 0;

  const pointResult = usePointPlanImages({
    pointId: itemId,
    planIds,
    regioId,
    enabled: enabledPoint,
  });

  const geometryResult = useGeometryPlanImages({
    geometryId: itemId,
    planIds,
    regioId,
    enabled: enabledGeometry,
  });

  const imageRows = useMemo(() => {
    if (!ok) return [];
    if (kind === "point") return pointResult.images;
    return geometryResult.images;
  }, [ok, kind, pointResult.images, geometryResult.images]);

  const [selectedPlan, setSelectedPlan] =
    useState<FinishedFlightPlanType | null>(null);

  useEffect(() => {
    if (filteredPlans.length === 0) {
      setSelectedPlan(null);
      return;
    }
    if (planIdFromQuery != null) {
      const match = filteredPlans.find((p) => p.id === planIdFromQuery);
      if (match) {
        setSelectedPlan(match);
        return;
      }
    }
    setSelectedPlan((prev) => {
      if (prev && filteredPlans.some((p) => p.id === prev.id)) return prev;
      return filteredPlans[0];
    });
  }, [filteredPlans, planIdFromQuery]);

  const rowsForSelectedPlan = useMemo(() => {
    if (!selectedPlan) return [];
    return imageRows.filter((r) => r.plan_id === selectedPlan.id);
  }, [imageRows, selectedPlan]);

  const images = useMemo(
    () => pointPlanImagesToAttachments(rowsForSelectedPlan),
    [rowsForSelectedPlan]
  );

  const imagesLoading = kind === "point" ? pointResult.loading : geometryResult.loading;
  const imagesError = kind === "point" ? pointResult.error : geometryResult.error;

  const imageKey = useMemo(
    () => images.map((a) => a.id).join(","),
    [images]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [imageKey]);

  useEffect(() => {
    if (images.length === 0) return;
    setSelectedIndex((i) => Math.min(i, images.length - 1));
  }, [images.length]);

  return {
    queryError: ok ? null : parsed.reason,
    invalidQuery: !ok,
    kind: ok ? kind : null,
    itemId: ok ? itemId : null,
    from,
    to,
    displayTitle,
    filteredPlans,
    selectedPlan,
    setSelectedPlan,
    planIds,
    allPlansLoading: plansLoading,
    plansError,
    needsAuth: ok && !user?.role,
    images,
    imagesLoading,
    imagesError,
    selectedIndex,
    setSelectedIndex,
    noPlansInRange: ok && !plansLoading && !plansError && allPlans.length === 0,
    noMatchingPlans:
      ok &&
      !plansLoading &&
      !plansError &&
      allPlans.length > 0 &&
      filteredPlans.length === 0,
  };
}
