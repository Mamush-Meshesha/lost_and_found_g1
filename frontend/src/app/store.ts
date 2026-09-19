import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import itemReducer from "../features/items/itemSlice";
import categoryReducer from "../features/category/categorySlice";
import proofReducer from "../features/proff/proofSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
    categories: categoryReducer,
    proofs: proofReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
