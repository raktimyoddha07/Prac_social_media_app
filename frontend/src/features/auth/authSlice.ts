import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("selectedConversation");
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
