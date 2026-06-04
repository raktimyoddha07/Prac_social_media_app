import API from "../../api/axios";

export const getConversations = async () => {
  const response = await API.get("/messages/conversations");
  return response.data;
};

export const createConversation = async (userId: string) => {
  const response = await API.post(`/messages/conversation/${userId}`);
  return response.data;
};

export const getMessages = async (conversationId: string) => {
  const response = await API.get(`/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (conversationId: string, content: string) => {
  const response = await API.post(`/messages/${conversationId}`, { content });

  return response.data;
};
