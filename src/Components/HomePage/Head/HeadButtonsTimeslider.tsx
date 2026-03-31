import { useState, useMemo, useCallback, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import DatePicker from "react-datepicker";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTimeRange } from "hooks/useTimeRange";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import {
  format,
  differenceInMilliseconds,
  parseISO,
  startOfDay,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const FALLBACK_MIN = new Date(2024, 0, 1);
const FALLBACK_MAX = new Date(2025, 11, 31);
const SLIDER_PARTS = 10;
/** Tailwind theme primary */
const PRIMARY_HEX = "#0070BC";
const TRACK_OUTER_HEX = "#e5e7eb";

const datePickerInputFocus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50";

const dateFieldWhiteBase =
  "bg-white shadow-sm transition-all duration-200 ease-out hover:border-primary/40 hover:shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/35 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:shadow-md";

function TimesliderDateField({
  variant,
  label,
  selected,
  onChange,
}: {
  variant: "from" | "to";
  label: string;
  selected: Date;
  onChange: (date: Date | null) => void;
}) {
  const popperPlacement = variant === "from" ? "bottom-start" : "bottom-end";
  const inputClassName =
    variant === "from"
      ? `!border-0 !shadow-none !rounded-none !rounded-r-lg bg-transparent py-2 px-2.5 w-[118px] !text-xs font-medium text-gray-800 cursor-pointer ${datePickerInputFocus}`
      : `!border-0 !shadow-none !rounded-none !rounded-l-lg bg-transparent py-2 px-2.5 w-[118px] !text-xs font-medium text-gray-800 cursor-pointer ${datePickerInputFocus}`;

  const labelClass =
    "flex shrink-0 items-center bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white";

  if (variant === "from") {
    return (
      <div className="flex shrink-0 shadow-sm">
        <span className={`${labelClass} rounded-l-lg rounded-r-none`}>
          {label}
        </span>
        <div
          className={`flex min-w-0 items-stretch rounded-r-lg rounded-l-none border-y border-r border-gray-200 ${dateFieldWhiteBase}`}
        >
          <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            wrapperClassName="timeslider-datepicker-wrapper"
            calendarClassName="timeslider-datepicker-calendar"
            popperClassName="timeslider-datepicker-popper"
            popperPlacement={popperPlacement}
            className={inputClassName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 shadow-sm">
      <div
        className={`flex min-w-0 items-stretch rounded-l-lg rounded-r-none border-y border-l border-gray-200 ${dateFieldWhiteBase}`}
      >
        <DatePicker
          selected={selected}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          wrapperClassName="timeslider-datepicker-wrapper"
          calendarClassName="timeslider-datepicker-calendar"
          popperClassName="timeslider-datepicker-popper"
          popperPlacement={popperPlacement}
          className={inputClassName}
        />
      </div>
      <span className={`${labelClass} rounded-r-lg rounded-l-none`}>
        {label}
      </span>
    </div>
  );
}

function clampToStepIndex(stepIndex: number, stepCount: number): number {
  return Math.max(0, Math.min(stepCount - 1, stepIndex));
}

export default function HeadButtonsTimeslider() {
  const content = useContent();
  const { user } = useAuth();
  const regioId = user?.role || undefined;
  const { range, loading } = useTimeRange(regioId);

  const { minDate, maxDate } = useMemo(() => {
    let min = FALLBACK_MIN;
    let max = FALLBACK_MAX;
    if (range.from && range.to) {
      const fromDate = parseISO(range.from);
      const toDate = parseISO(range.to);
      // Exact inspectiedatum bounds (no month padding)
      if (!isNaN(fromDate.getTime())) min = fromDate;
      if (!isNaN(toDate.getTime())) max = toDate;
    }
    if (min > max) [min, max] = [max, min];
    return {
      minDate: min,
      maxDate: max,
    };
  }, [range.from, range.to]);

  const maxStep = SLIDER_PARTS;
  const totalMs = Math.max(1, differenceInMilliseconds(maxDate, minDate));

  const stepIndexToDate = useCallback(
    (stepIndex: number): Date => {
      const ratio = stepIndex / maxStep;
      return new Date(minDate.getTime() + ratio * totalMs);
    },
    [minDate, totalMs, maxStep]
  );

  const dateToStepIndex = useCallback(
    (date: Date): number => {
      const distance = date.getTime() - minDate.getTime();
      const ratio = distance / totalMs;
      const stepIndex = Math.round(ratio * maxStep);
      return clampToStepIndex(stepIndex, maxStep + 1);
    },
    [minDate, totalMs, maxStep]
  );

  const [values, setValues] = useState<[number, number]>(() => [0, maxStep]);
  const [orderHint, setOrderHint] = useState<string | null>(null);

  useEffect(() => {
    setValues([0, maxStep]);
  }, [maxStep, range.from, range.to]);

  useEffect(() => {
    if (!orderHint) return;
    const id = window.setTimeout(() => setOrderHint(null), 4500);
    return () => window.clearTimeout(id);
  }, [orderHint]);

  const safeValues: [number, number] = useMemo(() => {
    const from = Math.max(0, Math.min(values[0], maxStep));
    const to = Math.max(0, Math.min(values[1], maxStep));
    return from <= to ? [from, to] : [to, to];
  }, [values, maxStep]);

  const dateFrom = useMemo(
    () => stepIndexToDate(safeValues[0]),
    [safeValues[0], stepIndexToDate]
  );
  const dateTo = useMemo(() => stepIndexToDate(safeValues[1]), [
    safeValues[1],
    stepIndexToDate,
  ]);

  const { setDateRange } = useTimesliderState();
  useEffect(() => {
    setDateRange(
      format(dateFrom, "yyyy-MM-dd"),
      format(dateTo, "yyyy-MM-dd")
    );
  }, [dateFrom, dateTo, setDateRange]);

  const handleSliderChange = useCallback((newValues: number[]) => {
    setOrderHint(null);
    setValues([newValues[0], newValues[1]]);
  }, []);

  const handleFromChange = (date: Date | null) => {
    if (!date) return;
    if (startOfDay(date) > startOfDay(dateTo)) {
      setOrderHint(content.layout.timeslider.invalidRangeHint);
    } else {
      setOrderHint(null);
    }
    const step = dateToStepIndex(date);
    const clamped = Math.max(0, Math.min(step, safeValues[1] - 1));
    setValues([clamped, safeValues[1]]);
  };

  const handleToChange = (date: Date | null) => {
    if (!date) return;
    if (startOfDay(date) < startOfDay(dateFrom)) {
      setOrderHint(content.layout.timeslider.invalidRangeHint);
    } else {
      setOrderHint(null);
    }
    const step = dateToStepIndex(date);
    const clamped = Math.min(maxStep, Math.max(step, safeValues[0] + 1));
    setValues([safeValues[0], clamped]);
  };

  const trackBackground = getTrackBackground({
    values: safeValues,
    min: 0,
    max: maxStep,
    colors: [TRACK_OUTER_HEX, PRIMARY_HEX, TRACK_OUTER_HEX],
  });

  if (loading) {
    return (
      <div className="flex w-full justify-center px-1">
        <div className="flex min-h-[88px] w-full max-w-5xl items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 shadow-sm">
          <p className="animate-pulse text-xs text-gray-400">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center px-1">
      <div className="flex min-h-[88px] w-full max-w-5xl items-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 shadow-sm">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <TimesliderDateField
            variant="from"
            label={content.layout.timeslider.van}
            selected={dateFrom}
            onChange={handleFromChange}
          />

          <div className="flex min-w-[min(100%,240px)] max-w-2xl flex-[1_1_240px] items-center px-1 sm:px-2">
            <Range
              step={1}
              min={0}
              max={maxStep}
              values={safeValues}
              onChange={handleSliderChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "10px",
                    width: "100%",
                    borderRadius: "9999px",
                    background: trackBackground,
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => {
                const { key, style, ...restProps } = props;
                return (
                  <div
                    key={key}
                    {...restProps}
                    className="transition-shadow duration-200 ease-out hover:shadow-[0_0_0_4px_rgba(0,112,188,0.22)] active:shadow-[0_0_0_3px_rgba(0,112,188,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    style={{
                      ...style,
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      backgroundColor: PRIMARY_HEX,
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0, 112, 188, 0.4)",
                      outline: "none",
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <TimesliderDateField
              variant="to"
              label={content.layout.timeslider.tot}
              selected={dateTo}
              onChange={handleToChange}
            />
            {orderHint ? (
              <p
                className="max-w-[220px] text-right text-[10px] font-medium leading-tight text-red-600"
                role="status"
              >
                {orderHint}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
