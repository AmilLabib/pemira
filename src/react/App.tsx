import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router";

import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedAdmin from "./components/Auth/ProtectedAdmin";
import AdminLogin from "./pages/Admin/AdminLogin";

import Home from "./pages/Home/HomePage";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import VerifyPage from "./pages/Admin/VerifyPage";

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pendaftaran" element={<RegistrationPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="verifikasi" replace />} />
          <Route path="verifikasi" element={<VerifyPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
