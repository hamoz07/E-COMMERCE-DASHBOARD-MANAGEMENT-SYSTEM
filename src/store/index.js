import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import cart from "./cart/cartSlice";
import toasts from "./toasts/toastSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["items"],
};

const persistedCartReducer = persistReducer(persistConfig, cart);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    toasts,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "toasts/addToast",
        ],
        ignoredPaths: [/^toasts\.records\.\d+\.onCloseToast$/],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };