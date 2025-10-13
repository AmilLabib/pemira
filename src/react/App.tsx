import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";

import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedAdmin from "./components/Auth/ProtectedAdmin";
import AdminLogin from "./pages/Admin/AdminLogin";
import VerifyPage from "./pages/Admin/VerifyPage";
import VerifyPemilih from "./pages/Admin/VerifyPemilih";
import AssignNumber from "./pages/Admin/AssignNumber";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home/HomePage";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import DaftarCalon from "./pages/DaftarCalon/DaftarCalon";

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="daftar-calon" element={<DaftarCalon />} />
          <Route path="daftar" element={<RegistrationPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<VerifyPemilih />} />
            <Route path="verifikasi" element={<VerifyPage />} />
            <Route path="assign-number" element={<AssignNumber />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
