import React from "react";
import { NavLink } from "react-router";

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded ${isActive ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`;

  return (
    <aside className="w-56 border-r p-3">
      <nav className="flex flex-col gap-1">
        <NavLink to="/admin/verify" className={linkClass}>
          Verify Candidates
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
