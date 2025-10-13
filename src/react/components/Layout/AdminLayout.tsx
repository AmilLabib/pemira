import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/admin/verifikasi", label: "Verifikasi Bakal Calon" },
    { to: "/admin/assign-number", label: "Assign Number" },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 lg:flex-row">
      {/* Top bar for mobile / small screens */}
      <header className="border-b border-slate-200 bg-white lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-3">
          <div className="text-lg font-semibold">Admin</div>
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="rounded-md p-2 hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0 lg:border-r lg:border-slate-200 lg:bg-transparent lg:p-4 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          aria-hidden={!mobileOpen && true}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="text-xl font-semibold">Admin</div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-md p-1 hover:bg-slate-100 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded px-2 py-1 text-slate-800 hover:bg-slate-100 ${
                    isActive ? "bg-slate-100 font-medium" : "text-slate-700"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            aria-hidden
            className="fixed inset-0 z-20 bg-black/25 lg:hidden"
          />
        )}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
