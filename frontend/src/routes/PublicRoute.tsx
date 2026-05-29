import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import type { RootState } from "../app/store";

interface Props {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
