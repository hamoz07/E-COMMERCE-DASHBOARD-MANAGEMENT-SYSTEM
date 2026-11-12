import axios from "axios";
import { useEffect, useRef } from "react";
import { GOOGLE_CALL_BACK, baseURL } from "../../api/endpoints.js";
import { useLocation } from "react-router-dom";
import Cookie from "cookie-universal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { clearCartAfterPlaceOrder } from "../../store/cart/cartSlice";
import {
  createCartMergeIdempotencyKey,
  useMergeCartMutation,
} from "../../hooks/cart/useMergeCart.js";
import { getGuestCartItems } from "../../utils/guestCart";

const cookie = Cookie();

const GOOGLECALLBACK = () => {
  const loc = useLocation();
  const dispatch = useAppDispatch();
  const guestCartItems = useAppSelector((state) => state.cart.items);
  const { mutateAsync: mergeGuestCart } = useMergeCartMutation();
  const queryClient = useQueryClient();
  const hasProcessedCallback = useRef(false);

  useEffect(() => {
    if (hasProcessedCallback.current) return;
    hasProcessedCallback.current = true;

    async function runCallBack() {
      try {
        const res = await axios.get(
          `${baseURL}/${GOOGLE_CALL_BACK}${loc.search}`
        );
        const token = res.data.access_token;
        cookie.set("user-token", token);

        if (Object.keys(guestCartItems).length > 0) {
          try {
            await mergeGuestCart({
              items: getGuestCartItems(guestCartItems),
              idempotencyKey: createCartMergeIdempotencyKey(),
            });
          } catch (mergeError) {
            cookie.remove("user-token");
            throw mergeError;
          }
          dispatch(clearCartAfterPlaceOrder());
        }
        queryClient.setQueryData(["authUser"], res.data.user);
      } catch (error) {
        console.error("Unable to merge guest cart after Google login:", error);
      }
    }
    runCallBack();
  }, [dispatch, guestCartItems, loc.search, mergeGuestCart, queryClient]);

  return <div>test</div>;
};

export default GOOGLECALLBACK;
