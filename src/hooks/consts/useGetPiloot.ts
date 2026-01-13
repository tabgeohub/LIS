import { useReadData } from "utils/useReadData";

export default function useGetPiloot() {
  const { data } = useReadData<
    {
      id: string;
      naam: string;
    }[]
  >("/consts/piloten");

  const formattedPolooten = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedPolooten) {
    const pilootOptions = [
      { label: "Selecteer een piloot", value: "" },
      ...formattedPolooten!,
    ];

    return pilootOptions;
  } else {
    return [];
  }
}
