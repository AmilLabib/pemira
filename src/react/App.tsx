import { useEffect, useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
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
import Pemilihan from "./pages/Pemilihan/Pemilihan";
import FAQ from "./pages/FAQ/FAQ";
import Jadwal from "./pages/Jadwal/Jadwal";

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <AuthProvider>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname}
          classNames="fade"
          timeout={300}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <Routes location={location}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="daftar-calon" element={<DaftarCalon />} />
                <Route path="daftar" element={<RegistrationPage />} />
                <Route path="pemilihan" element={<Pemilihan />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="jadwal" element={<Jadwal />} />
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
          </div>
        </CSSTransition>
      </SwitchTransition>
    </AuthProvider>
  );
};

export default App;
