import API from "../../api/axios";

export const getPosts = async () => {
  const response = await API.get("/posts");

  return response.data;
};

export const createPost = async (content: string, image_url: string) => {
  const response = await API.post("/posts", {
    content,
    image_url,
  });

  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await API.delete(`/posts/${postId}`);

  return response.data;
};

export const updatePost = async (postId: string, content: string) => {
  const response = await API.put(`/posts/${postId}`, {
    content,
  });

  return response.data;
};

export const likePost = async (postId: string) => {
  const response = await API.post(`/likes/${postId}`);

  return response.data;
};
