import { usePilotenQuery } from "api-hooks/consts";

export default function useGetPiloot() {
  const { data } = usePilotenQuery();

  const formattedPolooten = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedPolooten) {
    return [
      { label: "Selecteer een piloot", value: "" },
      ...formattedPolooten,
    ];
  }

  return [];
}
