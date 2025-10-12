import React from "react";
import { Link, Outlet } from "react-router";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl">
        <aside className="w-64 border-r bg-white p-4">
          <div className="mb-6 text-xl font-semibold">Admin</div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link
              to="/admin/verifikasi"
              className="block rounded px-2 py-1 hover:bg-slate-100"
            >
              Verifikasi Bakal Calon
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
