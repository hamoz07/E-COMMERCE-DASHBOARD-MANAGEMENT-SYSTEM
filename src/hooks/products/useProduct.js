import { useQuery } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { PROD } from "../../api/endpoints.js";

export const getProduct = async ({ signal, queryKey }) => {
  const id = queryKey[1]; // ["product", "42"] → id = "42"
  const res = await AX.get(`${PROD}/${id}`, { signal });
  if (!Array.isArray(res.data) || !res.data[0]) {
    throw new Error("Product was not found.");
  }
  return res.data[0];
};

export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", String(id)],
    queryFn: getProduct, // TanStack passes { signal, queryKey } automatically
    enabled: Boolean(id),
  });