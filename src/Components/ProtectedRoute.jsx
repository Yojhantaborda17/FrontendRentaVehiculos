import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking"); // checking - ok - fail

  useEffect(() => {
    axios.get("http://localhost:8000/auth/me", { withCredentials: true })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "checking") return <div>Cargando...</div>;
  if (status === "fail") return <Navigate to="/" replace />;

  return <Outlet /> 
}