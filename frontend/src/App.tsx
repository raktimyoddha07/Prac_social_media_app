import { useEffect } from "react";

import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import API from "./api/axios";

import { setUser } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await API.get("/auth/me");

        dispatch(setUser(response.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
