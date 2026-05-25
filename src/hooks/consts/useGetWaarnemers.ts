import { useWaarnemersQuery } from "api-hooks/consts";

export default function useGetWaarnemers() {
  const { data } = useWaarnemersQuery();

  const formattedWaarnemers = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedWaarnemers) {
    return [
      { label: "Selecteer een waarnemer", value: "" },
      ...formattedWaarnemers,
    ];
  }

  return [];
}
