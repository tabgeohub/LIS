import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { emailKeys } from "lib/queryKeys";
import { EmailType } from "Types";

export function useEmailsList() {
  return useQuery({
    queryKey: emailKeys.list(),
    queryFn: () => fetchApi<EmailType[]>("/emails"),
  });
}
