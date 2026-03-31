import { useState, useMemo, useCallback, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import DatePicker from "react-datepicker";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTimeRange } from "hooks/useTimeRange";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { format, differenceInMilliseconds, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const FALLBACK_MIN = new Date(2024, 0, 1);
const FALLBACK_MAX = new Date(2025, 11, 31);
const SLIDER_PARTS = 10;
/** Tailwind theme primary */
const PRIMARY_HEX = "#0070BC";
const TRACK_OUTER_HEX = "#e5e7eb";

function TimesliderDateInput({
  selected,
  onChange,
}: {
  selected: Date;
  onChange: (date: Date | null) => void;
}) {
  return (
    <div className="shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out hover:border-primary/40 hover:shadow-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-md">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        wrapperClassName="timeslider-datepicker-wrapper"
        calendarClassName="timeslider-datepicker-calendar"
        popperClassName="timeslider-datepicker-popper"
        popperPlacement="bottom-start"
        className="!border-0 !rounded-lg !shadow-none bg-transparent py-2 px-2.5 w-[118px] !text-xs font-medium text-gray-800 cursor-pointer focus:outline-none"
      />
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

  useEffect(() => {
    setValues([0, maxStep]);
  }, [maxStep, range.from, range.to]);

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
    setValues([newValues[0], newValues[1]]);
  }, []);

  const handleFromChange = (date: Date | null) => {
    if (!date) return;
    const step = dateToStepIndex(date);
    const clamped = Math.max(0, Math.min(step, safeValues[1] - 1));
    setValues([clamped, safeValues[1]]);
  };

  const handleToChange = (date: Date | null) => {
    if (!date) return;
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
      <div className="flex gap-x-1">
        <div className="border border-gray-200 px-4 py-2 bg-white rounded-lg shadow-sm flex items-center justify-center max-h-[120px] w-full min-h-[60px]">
          <p className="text-xs text-gray-400 animate-pulse">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-x-1">
      <div className="border border-gray-200 px-4 py-2 bg-white rounded-lg shadow-sm flex flex-col justify-between max-h-[120px] w-full">
        <div className="flex items-center justify-center gap-3 pt-1 pb-0.5 flex-1 min-h-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
              {content.layout.timeslider.van}
            </span>
            <TimesliderDateInput
              selected={dateFrom}
              onChange={handleFromChange}
            />
          </div>

          <div className="w-[75%] min-w-[220px] max-w-[900px] flex items-center px-2">
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
                  className="transition-shadow duration-200 ease-out hover:shadow-[0_0_0_4px_rgba(0,112,188,0.22)] active:shadow-[0_0_0_3px_rgba(0,112,188,0.35)]"
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

          <div className="flex items-center gap-2 shrink-0">
            <TimesliderDateInput
              selected={dateTo}
              onChange={handleToChange}
            />
            <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
              {content.layout.timeslider.tot}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 tracking-normal text-center mt-1 font-medium">
          {format(dateFrom, "dd/MM/yyyy")} – {format(dateTo, "dd/MM/yyyy")}
        </p>
      </div>
    </div>
  );
}
