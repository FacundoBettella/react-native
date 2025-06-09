import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import petsReducer from "./slices/petsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petsReducer,
  },
});
