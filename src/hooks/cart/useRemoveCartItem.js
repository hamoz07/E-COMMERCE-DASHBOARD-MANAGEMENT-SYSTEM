import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { refreshCart } from "./useRefreshCart";
// 3. Remove one item
const removeCartItem = async (cartId) => {
  const response = await AX.delete(`/cart/${cartId}`);

  return response.data;
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => refreshCart(queryClient),
  });
};
