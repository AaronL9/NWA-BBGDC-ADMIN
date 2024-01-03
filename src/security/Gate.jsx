import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Gate() {
  const { admin } = useAuthContext();

  return admin ? <Navigate to='dashboard' /> : <Outlet />
}
