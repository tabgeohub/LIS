import { useReadData } from "utils/useReadData";

export default function useGetActiviteiten() {
  const { data } = useReadData<
    {
      id: string;
      activiteit: string;
    }[]
  >("/consts/activiteiten");

  const formattedActivities = data?.map((item) => ({
    label: item.activiteit,
    value: item.id,
  }));

  if (formattedActivities) {
    const activities = [
      { label: "Selecteer een activiteit", value: "" },
      ...formattedActivities!,
    ];

    return activities;
  } else {
    return [];
  }
}
