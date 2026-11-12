import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {},
};

// This slice represents the local guest cart. Authenticated cart data belongs
// to the backend and is consumed through React Query.
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1 } = action.payload;
      state.items[id] = (state.items[id] || 0) + quantity;
    },
    cartItemChangeQuantity: (state, action) => {
      state.items[action.payload.id] = action.payload.quantity;
    },
    cartItemRemove: (state, action) => {
      delete state.items[action.payload];
    },
    clearCartAfterPlaceOrder: (state) => {
      state.items = {};
    },
  },
});

export const {
  addToCart,
  cartItemChangeQuantity,
  cartItemRemove,
  clearCartAfterPlaceOrder,
} = cartSlice.actions;

export default cartSlice.reducer;