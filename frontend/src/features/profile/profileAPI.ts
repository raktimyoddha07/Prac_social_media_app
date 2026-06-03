import API from "../../api/axios";

export const getProfile = async (userId: string) => {
  const response = await API.get(`/users/${userId}`);

  return response.data;
};

export const updateProfile = async (profileData: {
  username?: string;
  bio?: string;
}) => {
  const response = await API.put("/users/me", profileData);

  return response.data;
};
