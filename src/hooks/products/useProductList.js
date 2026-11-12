// hooks/useProductList.js
import { useQuery } from "@tanstack/react-query";
import { AX } from "../../api/client.js";

export const getProductList = async (endpoint) => {
  const res = await AX.get(endpoint);
  return res.data;
};

export const useProductList = (endpoint, queryKey) =>
  useQuery({
    queryKey: ["products", queryKey],
    queryFn: () => getProductList(endpoint),
    staleTime: 5 * 60 * 1000, // product lists don't need to refetch every mount
  });

export default useProductList;