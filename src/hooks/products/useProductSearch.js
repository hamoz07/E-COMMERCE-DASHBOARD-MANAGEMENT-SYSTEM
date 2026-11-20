import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { PRODUCT_SEARCH } from "../../api/endpoints.js";

const getSearchParams = (searchParams) => ({
  q: searchParams.get("q") || "",
  category: searchParams.getAll("category[]").length
    ? searchParams.getAll("category[]")
    : searchParams.get("category")
      ? [searchParams.get("category")]
      : [],
  min_price: searchParams.get("min_price") || "",
  max_price: searchParams.get("max_price") || "",
  rating: searchParams.get("rating") || "",
  in_stock: ["1", "true"].includes(searchParams.get("in_stock")),
  sort: searchParams.get("sort") || "relevance",
  page: searchParams.get("page") || "1",
  limit: searchParams.get("limit") || "6",
});

export const useProductSearch = (searchParams, enabled = true) => {
  const params = getSearchParams(searchParams);

  return useQuery({
    queryKey: ["products", "search", params],
    queryFn: async ({ signal }) => {
      const response = await AX.get(PRODUCT_SEARCH, {
        params: {
          ...params,
          category: params.category,
          in_stock: params.in_stock ? 1 : undefined,
        },
        signal,
      });

      return response.data;
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

export default useProductSearch;
