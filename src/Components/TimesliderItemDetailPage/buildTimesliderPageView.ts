import {
  type BuildTimesliderPageViewInput,
} from "./buildTimesliderPageViewParts";
import { assembleTimesliderPageView } from "./assembleTimesliderPageView";

export type { BuildTimesliderPageViewInput } from "./buildTimesliderPageViewParts";

export function buildTimesliderPageView(input: BuildTimesliderPageViewInput) {
  return assembleTimesliderPageView(input);
}
