import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
