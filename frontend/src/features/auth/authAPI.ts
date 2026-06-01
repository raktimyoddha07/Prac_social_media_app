import API from "../../api/axios";

import type { LoginData, RegisterData } from "../../types/auth";

export const registerUser = async (data: RegisterData) => {
  const response = await API.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const formData = new URLSearchParams();

  formData.append("username", data.email);
  formData.append("password", data.password);

  const response = await API.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};
