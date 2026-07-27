import { differenceInMilliseconds, parseISO } from "date-fns";

export const FALLBACK_MIN = new Date(2024, 0, 1);
export const FALLBACK_MAX = new Date(2025, 11, 31);
export const SLIDER_PARTS = 10;

function parseIsoOrUndefined(value: string): Date | undefined {
  const parsed = parseISO(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

function orderedDateRange(minDate: Date, maxDate: Date) {
  if (minDate <= maxDate) return { minDate, maxDate };
  return { minDate: maxDate, maxDate: minDate };
}

function fallbackTimesliderRange() {
  return { minDate: FALLBACK_MIN, maxDate: FALLBACK_MAX };
}

function boundOrFallback(value: string, fallback: Date): Date {
  return parseIsoOrUndefined(value) ?? fallback;
}

export function parseTimesliderRange(
  from?: string | null,
  to?: string | null
) {
  if (!from || !to) return fallbackTimesliderRange();

  return orderedDateRange(
    boundOrFallback(from, FALLBACK_MIN),
    boundOrFallback(to, FALLBACK_MAX)
  );
}

export function createTimesliderConversions(input: {
  minDate: Date;
  maxDate: Date;
  maxStep?: number;
}) {
  const maxStep = input.maxStep ?? SLIDER_PARTS;
  const totalMs = Math.max(
    1,
    differenceInMilliseconds(input.maxDate, input.minDate)
  );
  return {
    stepIndexToDate: (stepIndex: number) =>
      new Date(input.minDate.getTime() + (stepIndex / maxStep) * totalMs),
    dateToStepIndex: (date: Date) => {
      const step = Math.round(
        ((date.getTime() - input.minDate.getTime()) / totalMs) * maxStep
      );
      return Math.max(0, Math.min(maxStep, step));
    },
  };
}

export function normalizeSliderValues(
  values: [number, number],
  maxStep: number
): [number, number] {
  const from = Math.max(0, Math.min(values[0], maxStep));
  const to = Math.max(0, Math.min(values[1], maxStep));
  return from <= to ? [from, to] : [to, to];
}

export function clampFromStep(step: number, toStep: number) {
  return Math.max(0, Math.min(step, toStep - 1));
}

export function clampToStep(input: {
  step: number;
  fromStep: number;
  maxStep: number;
}) {
  return Math.min(input.maxStep, Math.max(input.step, input.fromStep + 1));
}
