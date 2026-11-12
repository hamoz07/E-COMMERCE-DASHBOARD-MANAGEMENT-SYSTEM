
// import { useMutation, useQueryClient } from "@tanstack/react-query";
export const refreshCart = (queryClient, productId) => {
  queryClient.invalidateQueries({
    queryKey: ["cartItems"],
  });

  if (productId !== undefined) {
    queryClient.invalidateQueries({
      queryKey: ["product", String(productId)],
    });
  }
};