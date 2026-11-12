import { AX } from "../../api/client.js";
import { refreshCart } from "./useRefreshCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const changeCartQuantity = async ({ cartId, quantity }) => {
  const response = await AX.patch(`/cart/${cartId}`, {
    count: quantity,
  });

  return response.data;
};

export const useChangeCartQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeCartQuantity,
    onMutate: async ({ productId, quantity, userId }) => {
      const cartQueryKey = ["cartItems", userId];

      await queryClient.cancelQueries({ queryKey: cartQueryKey });

      const previousCart = queryClient.getQueryData(cartQueryKey);

      queryClient.setQueryData(cartQueryKey, (currentCart = []) =>
        currentCart.map((item) =>
          String(item.product_id) === String(productId)
            ? { ...item, count: quantity }
            : item,
        ),
      );

      return { previousCart };
    },
    onError: (_error, variables, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(
          ["cartItems", variables.userId],
          context.previousCart,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      refreshCart(queryClient, variables.productId);
    },
  });
};