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
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const FALLBACK_MIN = new Date(2024, 0, 1);
const FALLBACK_MAX = new Date(2025, 11, 31);
const SLIDER_PARTS = 10;

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
      if (!isNaN(fromDate.getTime())) min = startOfMonth(fromDate);
      if (!isNaN(toDate.getTime())) max = endOfMonth(toDate);
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
  }, [maxStep]);

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

  const minDateStr = format(minDate, "dd/MM/yyyy");
  const maxDateStr = format(maxDate, "dd/MM/yyyy");

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
    colors: ["#374151", "#90CAF9", "#374151"],
  });

  if (loading) {
    return (
      <div className="flex gap-x-1">
        <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex items-center justify-center max-h-[120px] w-full min-h-[60px]">
          <p className="text-xs text-gray-400">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-x-1">
      <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between max-h-[120px] w-full">
        <div className="flex items-center justify-center gap-3 pt-2 pb-1 flex-1 min-h-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-orange-500 text-sm font-medium whitespace-nowrap">
              {content.layout.timeslider.van}
            </span>
            <DatePicker
              selected={dateFrom}
              onChange={handleFromChange}
              dateFormat="dd/MM/yyyy"
              minDate={minDate}
              maxDate={maxDate}
              className="inputClass !py-1 !text-xs w-[110px] cursor-pointer"
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
                    height: "8px",
                    width: "100%",
                    borderRadius: "4px",
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
                  style={{
                    ...style,
                    height: "18px",
                    width: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#90CAF9",
                    border: "2px solid #1e293b",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    outline: "none",
                  }}
                />
                );
              }}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <DatePicker
              selected={dateTo}
              onChange={handleToChange}
              dateFormat="dd/MM/yyyy"
              minDate={minDate}
              maxDate={maxDate}
              className="inputClass !py-1 !text-xs w-[110px] cursor-pointer"
            />
            <span className="text-orange-500 text-sm font-medium whitespace-nowrap">
              {content.layout.timeslider.tot}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 tracking-normal text-center mt-1">
          {format(dateFrom, "dd/MM/yyyy")} – {format(dateTo, "dd/MM/yyyy")}
        </p>
      </div>
    </div>
  );
}
