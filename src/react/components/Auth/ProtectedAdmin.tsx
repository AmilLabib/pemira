import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

function isAdminAuthed() {
  // simple check: presence of admin_token in localStorage
  const t = localStorage.getItem("admin_token");
  return Boolean(t);
}

const ProtectedAdmin: React.FC = () => {
  const location = useLocation();
  if (isAdminAuthed()) return <Outlet />;
  // redirect to admin login page, preserve attempted path
  return <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export default ProtectedAdmin;
