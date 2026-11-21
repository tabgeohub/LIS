import { describe, expect, it, vi } from "vitest";
import { createStore } from "zustand/vanilla";
import { createEnrichedPointActions } from "./enrichedPointStateActions";
import { initialEnrichedPointValues } from "./enrichedPointStateDefaults";
import type { EnrichedPointState } from "./enrichedPointStateTypes";

describe("enriched point coordinate setters", () => {
  it.each([
    ["xCoord", "setXCoord", 155000],
    ["yCoord", "setYCoord", 463000],
    ["longitude", "setLongitude", 5.387],
    ["latitude", "setLatitude", 52.156],
  ] as const)("notifies subscribers only when %s changes", (field, setter, value) => {
    const store = createStore<EnrichedPointState>((set) => ({
      ...initialEnrichedPointValues,
      ...createEnrichedPointActions(set),
    }));
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    const initialState = store.getState();

    initialState[setter](initialState[field]);
    expect(store.getState()).toBe(initialState);
    expect(listener).not.toHaveBeenCalled();

    initialState[setter](value);
    const updatedState = store.getState();
    expect(updatedState[field]).toBe(value);
    expect(listener).toHaveBeenCalledTimes(1);

    updatedState[setter](value);
    expect(store.getState()).toBe(updatedState);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
