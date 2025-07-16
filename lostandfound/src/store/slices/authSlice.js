import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  profile: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { authUser, profile } = action.payload;
      state.authUser = authUser || null;
      state.profile = profile || null;
    },
    clearUser: (state) => {
      state.authUser = null;
      state.profile = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
