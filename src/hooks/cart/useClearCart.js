import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { refreshCart } from "./useRefreshCart";
// 4. Clear the cart after a successful order
const clearCart = async () => {
  const response = await AX.delete("/cart");

  return response.data;
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => refreshCart(queryClient),
  });
};