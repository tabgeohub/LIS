import toast from "react-hot-toast";

export const FLIGHT_PLAN_SAVED_TOAST =
  "Ga naar “Vluchtplan-informatie” om je vlucht te controleren of bij te werken.";

/** Shared post-create UX: delayed toast, then cleanup callbacks. */
export function runFlightPlanCreateSuccess(input: {
  onCleanup?: () => void;
  toastMessage?: string;
  toastDelayMs?: number;
}) {
  const delay = input.toastDelayMs ?? 1000;
  const message = input.toastMessage ?? FLIGHT_PLAN_SAVED_TOAST;

  setTimeout(() => {
    toast(message, { duration: 5000 });
  }, delay);

  input.onCleanup?.();
}
