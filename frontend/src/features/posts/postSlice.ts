import { createSlice } from "@reduxjs/toolkit";

interface PostState {
  posts: any[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",

  initialState,

  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = postSlice.actions;

export default postSlice.reducer;
