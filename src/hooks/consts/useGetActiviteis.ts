import { useActiviteitenQuery } from "api-hooks/consts";

export default function useGetActiviteiten() {
  const { data } = useActiviteitenQuery();

  const formattedActivities = data?.map((item) => ({
    label: item.activiteit,
    value: item.id,
  }));

  if (formattedActivities) {
    return [
      { label: "Selecteer een activiteit", value: "" },
      ...formattedActivities,
    ];
  }

  return [];
}
