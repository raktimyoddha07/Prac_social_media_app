import API from "../../api/axios";

export const getCurrentUser = async () => {
  const response = await API.get("/users/me");

  return response.data;
};
