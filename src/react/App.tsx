import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";

import Home from "./pages/Home/HomePage";
import DaftarCalon from "./pages/DaftarCalon/DaftarCalonPage";

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="daftar-calon" element={<DaftarCalon />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
