import { configureStore } from "@reduxjs/toolkit";
import ToastSlice from "./ToastSlice";

const store = configureStore({
  reducer: ToastSlice.reducer,
});

export default store;