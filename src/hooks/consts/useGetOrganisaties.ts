import { useOrganisatiesQuery } from "api-hooks/consts";

export default function useGetOrganisaties() {
  const { data } = useOrganisatiesQuery();

  const formattedOrganisaties = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedOrganisaties) {
    return [
      { label: "Selecteer een organisatie", value: "" },
      ...formattedOrganisaties,
    ];
  }

  return [];
}
