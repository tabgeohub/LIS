import { useReadData } from "utils/useReadData";

export default function useGetWaarnemers() {
  const { data } = useReadData<
    {
      id: string;
      naam: string;
    }[]
  >("/consts/waarnemers");

  const formattedWaarnemers = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedWaarnemers) {
    const waarnemersOptions = [
      { label: "Selecteer een waarnemer", value: "" },
      ...formattedWaarnemers!,
    ];

    return waarnemersOptions;
  } else {
    return [];
  }
}
