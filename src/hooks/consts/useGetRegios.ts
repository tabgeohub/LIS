import { useRegiosQuery } from "api-hooks/consts";

export default function useGetRegios() {
  const { data } = useRegiosQuery();

  const formattedRegios = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedRegios) {
    return [
      { label: "ALL", value: "admin" },
      ...formattedRegios,
    ];
  }

  return [];
}
