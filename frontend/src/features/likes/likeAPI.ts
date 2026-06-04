import API from "../../api/axios";

export const likePost = async (postId: string) => {
  const response = await API.post(`/posts/${postId}/like`);

  return response.data;
};

// export const unlikePost = async (postId: string) => {
//   const response = await API.delete(`/posts/${postId}/like`);

//   return response.data;
// };

export const getLikesCount = async (postId: string) => {
  const response = await API.get(`/posts/${postId}/likes`);

  return response.data;
};

export const isPostLiked = async (postId: string) => {
  const response = await API.get(`/posts/${postId}/liked`);

  return response.data;
};