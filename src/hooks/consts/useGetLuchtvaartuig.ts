import { useReadData } from "utils/useReadData";

export default function useGetLuchtvaartuig() {
  const { data } = useReadData<
    {
      id: string;
      naam: string;
    }[]
  >("/consts/luchtvaartuig");

  const formattedLuchtvaartuig = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedLuchtvaartuig) {
    const luchtvaartuig = [
      { label: "Selecteer een luchtvaartuig", value: "" },
      ...formattedLuchtvaartuig!,
    ];

    return luchtvaartuig;
  } else {
    return [];
  }
}
