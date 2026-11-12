import { useQuery } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { CAT } from "../../api/endpoints.js";

export const getCategories = async ({ signal }) => {
  const res = await AX.get(`/${CAT}`, { signal });
  return res.data;
};

export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // categories rarely change — 10 min is reasonable
  });

export default useGetCategories