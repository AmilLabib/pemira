import React, { useEffect, useRef, lazy, Suspense } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Routes, Route, useLocation } from "react-router";

import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy loaded pages/components to reduce initial bundle & parse time
const AdminLayout = lazy(() => import("./components/Layout/AdminLayout"));
const ProtectedAdmin = lazy(() => import("./components/Auth/ProtectedAdmin"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const VerifyPage = lazy(() => import("./pages/Admin/VerifyPage"));
const VerifyPemilih = lazy(() => import("./pages/Admin/VerifyPemilih"));

const Home = lazy(() => import("./pages/MainWeb/Home/HomePage"));
const RegistrationPage = lazy(
  () => import("./pages/MainWeb/Registration/RegistrationPage"),
);
const DaftarCalon = lazy(
  () => import("./pages/MainWeb/DaftarCalon/DaftarCalon"),
);
const Pemilihan = lazy(() => import("./pages/MainWeb/Pemilihan/Pemilihan"));
const FAQ = lazy(() => import("./pages/MainWeb/FAQ/FAQ"));
const Jadwal = lazy(() => import("./pages/MainWeb/Jadwal/Jadwal"));

const VoteLayout = lazy(() => import("./components/Layout/VoteLayout"));
const Vote = lazy(() => import("./pages/WebVote/Vote/Vote"));
const Sertif = lazy(() => import("./pages/WebVote/Sertif/Sertif"));
const Landing = lazy(() => import("./pages/WebVote/Landing/Landing"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <AuthProvider>
      <Suspense fallback={<div />}>
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
                  </Route>
                </Route>
                <Route path="/voting" element={<VoteLayout />}>
                  <Route index element={<Landing />} />
                  <Route path="vote" element={<Vote />} />
                  <Route path="sertif" element={<Sertif />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
