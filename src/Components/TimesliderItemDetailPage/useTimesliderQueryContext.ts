import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { parseTimesliderImageQuery } from "./parseTimesliderImageQuery";

export function useTimesliderQueryContext() {
  const [searchParams] = useSearchParams();
  const parsed = useMemo(
    () => parseTimesliderImageQuery(searchParams),
    [searchParams]
  );
  const { user } = useAuth();
  const ok = parsed.ok;

  return {
    ok,
    from: ok ? parsed.from : "",
    to: ok ? parsed.to : "",
    itemId: ok ? parsed.id : 0,
    kind: ok ? parsed.kind : ("point" as const),
    planIdFromQuery: ok ? parsed.planId : null,
    regioId: user?.role,
    needsAuth: ok && !user?.role,
    queryReason: ok ? "" : parsed.reason,
    user,
  };
}
