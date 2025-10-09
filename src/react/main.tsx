import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./index.css";

import Home from "./pages/HomePage";
import Ballot from "./pages/BallotPage";
import Login from "./pages/LoginPage";

const root = document.getElementById("root")!;

createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ballot" element={<Ballot />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>,
);
