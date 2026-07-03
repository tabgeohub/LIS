import { PageType } from "Types";
import content from "../../../../constants/content.json";

export const pages: {
  label: string;
  value: PageType;
  new?: boolean;
}[] = [
  {
    label: content.layout.pages.at(0)!,
    value: "voorbereiding",
  },
  {
    label: content.layout.pages.at(1)!,
    value: "nabewerking",
  },
  {
    label: content.layout.pages.at(2)!,
    value: "tools",
  },
  {
    label: content.layout.pages.at(3)!,
    value: "timeslider",
    new: true,
  },
];
