import { useLuchtvaartuigQuery } from "api-hooks/consts";

export default function useGetLuchtvaartuig() {
  const { data } = useLuchtvaartuigQuery();

  const formattedLuchtvaartuig = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedLuchtvaartuig) {
    return [
      { label: "Selecteer een luchtvaartuig", value: "" },
      ...formattedLuchtvaartuig,
    ];
  }

  return [];
}
