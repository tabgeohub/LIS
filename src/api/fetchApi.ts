import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

export async function fetchApi<T>(path: string): Promise<T> {
  const response = await axios.get<T>(`${getBackEndUrl()}/api${path}`, {
    withCredentials: true,
  });
  return response.data;
}
