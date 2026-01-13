import content from "../constants/content.json";

export type Content = typeof content;

export function useContent() {
  return content; // sync, typed
}
