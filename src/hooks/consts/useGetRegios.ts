import { useReadData } from "utils/useReadData";

export default function useGetRegios() {
  const { data } = useReadData<
    {
      id: string;
      naam: string;
      shape_Length: number;
      shape_Area: number;
    }[]
  >("/consts/regios");

  const formattedRegios = data?.map((item) => ({
    label: item.naam,
    value: item.id,
  }));

  if (formattedRegios) {
    const regios = [
      {
        label: "ALL",
        value: "admin",
      },
      ...formattedRegios!,
    ];

    return regios;
  } else {
    return [];
  }
}
