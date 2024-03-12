import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Authorization() {
  const { admin } = useAuthContext();

  return admin ? <Outlet /> : <Navigate to="/" />;
}
