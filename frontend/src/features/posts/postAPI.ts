import API from "../../api/axios";

// Get Posts
export const getPosts = async () => {
  const response = await API.get("/posts");
  return response.data;
};

//Create Posts
export const createPost = async (content: string, image_url: string) => {
  const response = await API.post("/posts", {
    content,
    image_url,
  });

  return response.data;
};

//Delete Posts
export const deletePost = async (postId: string) => {
  const response = await API.delete(`/posts/${postId}`);

  return response.data;
};

//Update Posts
export const updatePost = async (
  postId: string,
  data: {
    content?: string;
    image_url?: string;
  },
) => {
  const response = await API.put(`/posts/${postId}`, data);

  return response.data;
};

export const likePost = async (postId: string) => {
  const response = await API.post(`/likes/${postId}`);

  return response.data;
};

export const dislikePost = async (postId: string) => {
  const response = await API.post(`/dislikes/${postId}`);

  return response.data;
};

export const getUserPosts = async (userId: string) => {
  const response = await API.get(`/posts/user/${userId}`);

  return response.data;
};