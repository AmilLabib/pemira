import React from "react";
import { Routes, Route, Navigate } from "react-router";

import Home from "./pages/Home/HomePage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
