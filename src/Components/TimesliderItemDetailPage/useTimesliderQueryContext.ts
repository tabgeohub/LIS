import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import {
  parseTimesliderImageQuery,
  type ParsedTimesliderQuery,
} from "./parseTimesliderImageQuery";

function buildQueryFields(parsed: ParsedTimesliderQuery) {
  if (!parsed.ok) {
    return {
      ok: false as const,
      from: "",
      to: "",
      itemId: 0,
      kind: "point" as const,
      planIdFromQuery: null,
      queryReason: parsed.reason,
    };
  }

  return {
    ok: true as const,
    from: parsed.from,
    to: parsed.to,
    itemId: parsed.id,
    kind: parsed.kind,
    planIdFromQuery: parsed.planId,
    queryReason: "",
  };
}

export function useTimesliderQueryContext() {
  const [searchParams] = useSearchParams();
  const parsed = useMemo(
    () => parseTimesliderImageQuery(searchParams),
    [searchParams]
  );
  const { user } = useAuth();
  const fields = buildQueryFields(parsed);

  return {
    ...fields,
    regioId: user?.role,
    needsAuth: fields.ok && !user?.role,
    user,
  };
}
