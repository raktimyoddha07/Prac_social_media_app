import API from "../../api/axios";

export const dislikePost = async (postId: string) => {
  const response = await API.post(`/posts/${postId}/dislike`);

  return response.data;
};

export const undislikePost = async (postId: string) => {
  const response = await API.delete(`/posts/${postId}/dislike`);

  return response.data;
};

export const getDislikesCount = async (postId: string) => {
  const response = await API.get(`/posts/${postId}/dislikes`);

  return response.data;
};

export const isPostDisliked = async (postId: string) => {
  const response = await API.get(`/posts/${postId}/disliked`);

  return response.data;
};
