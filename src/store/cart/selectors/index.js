import { createSelector } from "@reduxjs/toolkit";
const selectCartItems = (state) => state.cart.items;
const selectGuestCartItems = selectCartItems;
const getCartTotalQuantitySelector = createSelector(
  selectCartItems,
  (items) => {
    const totalQuantity = Object.values(items).reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      },
      0
    );
    return totalQuantity;
  }
);

export { getCartTotalQuantitySelector, selectGuestCartItems };
