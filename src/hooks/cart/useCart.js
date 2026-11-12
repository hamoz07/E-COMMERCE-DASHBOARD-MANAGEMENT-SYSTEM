import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  cartItemChangeQuantity,
  cartItemRemove,
  clearCartAfterPlaceOrder,
} from "../../store/cart/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { fetchProductsByItems } from "../../api/cart.js";
import { useChangeCartQuantityMutation } from "./useChangeCartQuantity";
import { useRemoveCartItemMutation } from "./useRemoveCartItem";
import { useClearCartMutation } from "./useClearCart";
import { useState } from "react";
import { isAuthenticated } from "../../api/auth.js";
import { useCurrentUser } from "../../context/currentUserContext.jsx";
import { addToast } from "../../store/toasts/toastSlice";

const useCart = () => {
  const dispatch = useAppDispatch();
  const [cartActionError, setCartActionError] = useState(null);
  const [pendingCartItemIds, setPendingCartItemIds] = useState([]);
  const authenticated = isAuthenticated();
  const changeCartQuantityMutation = useChangeCartQuantityMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();
  const { currentUser: user, userLoading: isUserLoading, userError } = useCurrentUser();

  // 1. Get local quantities dictionary from Redux
  const items = useAppSelector((state) => state.cart.items);
  const itemsIds = Object.keys(items);
  
  const {
    data: productsFullInfo = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["cartProducts", itemsIds],
    queryFn: () => fetchProductsByItems(itemsIds),
    enabled: !authenticated && itemsIds.length > 0,
  });

  const {
    data: cartItems = [],
    isLoading: isCartLoading,
    error: cartError,
  } = useQuery({
    queryKey: ["cartItems", user?.id],
    queryFn: async () => {
      const response = await AX.get("/cart");
      return response.data;
    },
    enabled: authenticated && Boolean(user?.id),
  });

  const cartItem = (id) => cartItems.find((item) => String(item.product_id) === String(id));

  const changeQuantityHandler = (id, quantity) => {
    const currentCartItem = cartItem(id);
    const product = authenticated
      ? currentCartItem?.product
      : productsFullInfo.find(
      (item) => String(item.id) === String(id)
        );

    setCartActionError(null);

    if (product && quantity > Number(product.stock)) {
      dispatch(
        addToast({
          title: "Cart",
          type: "warning",
          message: `Only ${product.stock} item${Number(product.stock) === 1 ? "" : "s"} available.`,
        }),
      );
      setCartActionError({
        id,
        status: 400,
        message: `Only ${product.stock} item${
          Number(product.stock) === 1 ? "" : "s"
        } available.`,
      });
      return;
    }

    if (!authenticated) {
      dispatch(cartItemChangeQuantity({ id, quantity }));
      dispatch(
        addToast({
          title: "Cart updated",
          type: "success",
          message: "The item quantity was updated.",
        }),
      );
      return;
    }

    if (!currentCartItem) {
      console.error(`Cart item for product ${id} was not found.`);
      return;
    }

    setPendingCartItemIds((ids) => [
      ...new Set([...ids, String(id)]),
    ]);

    changeCartQuantityMutation.mutate(
      {
        cartId: currentCartItem.id,
        productId: id,
        quantity,
        userId: user?.id,
      },
      {
        onError: (error) => {
          const message =
            error.response?.data?.error ||
            error.response?.data?.errors?.quantity?.[0] ||
            error.response?.data?.message ||
            "Unable to update cart quantity.";

          setCartActionError({
            id,
            status: error.response?.status,
            message,
          });
          dispatch(
            addToast({
              title: "Unable to update cart",
              type: "danger",
              message,
            }),
          );
          console.error(
            "Unable to update cart quantity:",
            error.response?.data || error
          );
        },
        onSuccess: () => {
          dispatch(
            addToast({
              title: "Cart updated",
              type: "success",
              message: "The item quantity was updated.",
            }),
          );
        },
        onSettled: () => {
          setPendingCartItemIds((ids) =>
            ids.filter((itemId) => itemId !== String(id)),
          );
        },
      }
    );
  };

  const removeItemHandler = (id) => {
    const currentCartItem = cartItem(id);

    if (!authenticated) {
      dispatch(cartItemRemove(id));
      dispatch(
        addToast({
          title: "Item removed",
          type: "success",
          message: "The item was removed from your cart.",
        }),
      );
      setCartActionError(null);
      return;
    }

    if (!currentCartItem) {
      console.error(`Cart item for product ${id} was not found.`);
      return;
    }

    setCartActionError(null);

    setPendingCartItemIds((ids) => [
      ...new Set([...ids, String(id)]),
    ]);

    removeCartItemMutation.mutate(currentCartItem.id, {
      onError: (error) => {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to remove cart item.";
        setCartActionError({
          id,
          status: error.response?.status,
          message,
        });
        dispatch(
          addToast({
            title: "Unable to remove item",
            type: "danger",
            message,
          }),
        );
        console.error(
          "Unable to remove cart item:",
          error.response?.data || error
        );
      },
      onSuccess: () => {
        dispatch(
          addToast({
            title: "Item removed",
            type: "success",
            message: "The item was removed from your cart.",
          }),
        );
      },
      onSettled: () => {
        setPendingCartItemIds((ids) =>
          ids.filter((itemId) => itemId !== String(id)),
        );
      },
    });
  };

  const clearCartHandler = (onCleared) => {
    setCartActionError(null);

    if (!authenticated) {
      dispatch(clearCartAfterPlaceOrder());
      dispatch(
        addToast({
          title: "Cart cleared",
          type: "success",
          message: "All items were removed from your cart.",
        }),
      );
      onCleared?.();
      return;
    }

    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          addToast({
            title: "Cart cleared",
            type: "success",
            message: "All items were removed from your cart.",
          }),
        );
        onCleared?.();
      },
      onError: (error) => {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to clear cart.";
        setCartActionError({
          id: null,
          status: error.response?.status,
          message,
        });
        dispatch(
          addToast({
            title: "Unable to clear cart",
            type: "danger",
            message,
          }),
        );
        console.error(
          "Unable to clear cart:",
          error.response?.data || error
        );
      },
    });
  };

  const products = authenticated
    ? cartItems.map((item) => ({
        ...item.product,
        id: item.product.id,
        cartId: item.id,
        quantity: item.count,
      }))
    : productsFullInfo.map((product) => ({
        ...product,
        quantity: items[product.id],
        cartId: cartItem(product.id)?.id,
      }));

  return {
    loading: authenticated
      ? isUserLoading || isCartLoading
      : isProductsLoading,
    error:
      productsError?.message ||
      userError?.message ||
      cartError?.message ||
      null,
    cartActionError,
    products,
    changeQuantityHandler,
    removeItemHandler,
    clearCartHandler,
    isCartClearingPending:clearCartMutation.isPending,
    isCartMutationPending:
      changeCartQuantityMutation.isPending ||
      removeCartItemMutation.isPending,
    isCartItemMutationPending: (id) =>
      pendingCartItemIds.includes(String(id)),
  };
};

export default useCart;