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

    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    toggleLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);

      if (!post) return;

      if (post.liked_by_user) {
        post.likes_count -= 1;
        post.liked_by_user = false;
      } else {
        post.likes_count += 1;
        post.liked_by_user = true;
      }
    },

    updatePost: (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);

      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    
    deletePost: (state, action) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setPosts, addPost, toggleLike, updatePost, deletePost} = postSlice.actions;

export default postSlice.reducer;
