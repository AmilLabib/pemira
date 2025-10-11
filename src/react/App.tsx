import React from "react";
import { Routes, Route, Navigate } from "react-router";

import Home from "./pages/Home/HomePage";
import Ballot from "./pages/Pemilih/BallotPage";
import Login from "./pages/Pemilih/LoginPage";
import CandidatePage from "./pages/BakalCalon/CandidatePage";
import VerifyCandidatePage from "./pages/Admin/VerifyCandidatePage";
import AdminLayout from "./components/Admin/AdminLayout";

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="bakalcalon/daftar" element={<CandidatePage />} />
      <Route path="pemilih">
        <Route path="login" element={<Login />} />
        <Route path="ballot" element={<Ballot />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route path="verify" element={<VerifyCandidatePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
