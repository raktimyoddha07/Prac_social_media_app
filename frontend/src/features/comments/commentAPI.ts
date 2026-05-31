import API from "../../api/axios";

export const createComment = async (postId: string, commentText: string) => {
  const response = await API.post(`/posts/${postId}/comments`, {
    comment_text: commentText,
  });

  return response.data;
};

export const getComments = async (postId: string) => {
  const response = await API.get(`/posts/${postId}/comments`);

  return response.data;
};

export const updateComment = async (commentId: string, commentText: string) => {
  const response = await API.put(`/comments/${commentId}`, {
    comment_text: commentText,
  });

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await API.delete(`/comments/${commentId}`);

  return response.data;
};
