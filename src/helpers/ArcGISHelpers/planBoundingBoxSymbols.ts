import type { PlanBoundingBoxSymbolOptions } from "./planBoundingBoxTypes";
import { PLAN_BOUNDING_BOX_SYMBOLS_CORE } from "./planBoundingBoxSymbolsCore";
import { PLAN_BOUNDING_BOX_SYMBOLS_STAR } from "./planBoundingBoxSymbolsStar";

export const PLAN_BOUNDING_BOX_SYMBOLS = {
  ...PLAN_BOUNDING_BOX_SYMBOLS_CORE,
  ...PLAN_BOUNDING_BOX_SYMBOLS_STAR,
} as const;

export const DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS: Required<PlanBoundingBoxSymbolOptions> =
  PLAN_BOUNDING_BOX_SYMBOLS.click;
