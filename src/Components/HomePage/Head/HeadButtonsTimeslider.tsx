import { useState, useMemo, useCallback } from "react";
import { Range, getTrackBackground } from "react-range";
import { useContent } from "hooks/useContent";
import {
  format,
  parse,
  addMonths,
  differenceInMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const MIN_DATE = new Date(2024, 0, 1);
const MAX_DATE = new Date(2025, 11, 31);
const STEP_MONTHS = 3;
const INITIAL_FROM = MIN_DATE;
const INITIAL_TO = MAX_DATE;

const STEP_COUNT = Math.floor(
  differenceInMonths(MAX_DATE, MIN_DATE) / STEP_MONTHS
) + 1;

function stepIndexToDate(stepIndex: number): Date {
  return startOfMonth(addMonths(MIN_DATE, stepIndex * STEP_MONTHS));
}

function dateToStepIndex(date: Date): number {
  const monthsFromStart = differenceInMonths(date, MIN_DATE);
  const stepIndex = Math.round(monthsFromStart / STEP_MONTHS);
  return Math.max(0, Math.min(STEP_COUNT - 1, stepIndex));
}

export default function HeadButtonsTimeslider() {
  const content = useContent();
  const minDateStr = format(INITIAL_FROM, "yyyy-MM-dd");
  const maxDateStr = format(INITIAL_TO, "yyyy-MM-dd");

  const [values, setValues] = useState<[number, number]>([0, STEP_COUNT - 1]);

  const dateFrom = useMemo(() => stepIndexToDate(values[0]), [values[0]]);
  const dateTo = useMemo(() => {
    const periodEnd = addMonths(
      MIN_DATE,
      (values[1] + 1) * STEP_MONTHS - 1
    );
    return endOfMonth(
      periodEnd > MAX_DATE ? MAX_DATE : periodEnd
    );
  }, [values[1]]);

  const dateFromStr = format(dateFrom, "yyyy-MM-dd");
  const dateToStr = format(dateTo, "yyyy-MM-dd");

  const handleSliderChange = useCallback((newValues: number[]) => {
    setValues([newValues[0], newValues[1]]);
  }, []);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parse(e.target.value, "yyyy-MM-dd", new Date());
    const step = dateToStepIndex(parsed);
    const clamped = Math.max(0, Math.min(step, values[1] - 1));
    setValues([clamped, values[1]]);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parse(e.target.value, "yyyy-MM-dd", new Date());
    const step = dateToStepIndex(parsed);
    const clamped = Math.min(STEP_COUNT - 1, Math.max(step, values[0] + 1));
    setValues([values[0], clamped]);
  };

  const trackBackground = getTrackBackground({
    values,
    min: 0,
    max: STEP_COUNT - 1,
    colors: ["#374151", "#90CAF9", "#374151"],
  });

  return (
    <div className="flex gap-x-1">
      <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between max-h-[120px] w-full">
        <div className="flex items-center justify-center gap-3 pt-2 pb-1 flex-1 min-h-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-orange-500 text-sm font-medium whitespace-nowrap">
              {content.layout.timeslider.van}
            </span>
            <input
              className="inputClass !py-1 !text-xs w-[110px]"
              type="date"
              min={minDateStr}
              max={maxDateStr}
              value={dateFromStr}
              onChange={handleFromChange}
            />
          </div>

          <div className="w-[75%] min-w-[220px] max-w-[900px] flex items-center px-2">
            <Range
              step={1}
              min={0}
              max={STEP_COUNT - 1}
              values={values}
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
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "18px",
                    width: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#90CAF9",
                    border: "2px solid #1e293b",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    outline: "none",
                  }}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              className="inputClass !py-1 !text-xs w-[110px]"
              type="date"
              min={minDateStr}
              max={maxDateStr}
              value={dateToStr}
              onChange={handleToChange}
            />
            <span className="text-orange-500 text-sm font-medium whitespace-nowrap">
              {content.layout.timeslider.tot}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 tracking-normal text-center mt-1">
          {format(dateFrom, "dd-MM-yyyy")} – {format(dateTo, "dd-MM-yyyy")}
        </p>
      </div>
    </div>
  );
}