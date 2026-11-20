// hooks/useProductList.js
import { useQuery } from "@tanstack/react-query";
import { AX } from "../../api/client.js";

export const getProductList = async (endpoint, categoryId) => {
  const res = await AX.get(endpoint, {
    params: categoryId ? { category: categoryId } : undefined,
  });
  return res.data;
};

export const useProductList = (endpoint, queryKey, categoryId, options = {}) =>
  useQuery({
    queryKey: ["products", queryKey, categoryId || "all"],
    queryFn: () => getProductList(endpoint, categoryId),
    ...options,
    staleTime: 5 * 60 * 1000, // product lists don't need to refetch every mount
  });

export default useProductList;