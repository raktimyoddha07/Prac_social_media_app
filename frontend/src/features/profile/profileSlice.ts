import { createSlice } from "@reduxjs/toolkit";

interface ProfileState {
  profileUser: any | null;
}

const initialState: ProfileState = {
  profileUser: null,
};

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    setProfileUser: (state, action) => {
      state.profileUser = action.payload;
    },

    updateProfileUser: (state, action) => {
      state.profileUser = action.payload;
    },

    clearProfileUser: (state) => {
      state.profileUser = null;
    },
  },
});

export const { setProfileUser, updateProfileUser, clearProfileUser } =
  profileSlice.actions;

export default profileSlice.reducer;
