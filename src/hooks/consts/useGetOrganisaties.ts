import { useReadData } from "utils/useReadData";

export default function useGetOrganisaties() {
  const { data } = useReadData<
    {
      id: string;
      naam: string;
    }[]
  >("/consts/organisaties");

  const formattedOrganisaties = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedOrganisaties) {
    const activities = [
      { label: "Selecteer een organisatie", value: "" },
      ...formattedOrganisaties!,
    ];

    return activities;
  } else {
    return [];
  }
}
