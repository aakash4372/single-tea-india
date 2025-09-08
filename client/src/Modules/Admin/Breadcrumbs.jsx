// src/components/Breadcrumbs.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // split and remove "admin"
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== "admin");

  return (
    <nav className="flex items-center text-sm text-gray-600 space-x-2">
      {/* Always show Dashboard as root */}
      <NavLink to="/admin" className="hover:text-gray-800 font-medium">
        Dashboard
      </NavLink>

      {pathnames.map((value, index) => {
        const to = `/admin/${pathnames.slice(0, index + 1).join("/")}`;
        const label =
          value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");

        return (
          <span key={to} className="flex items-center">
            <span className="mx-2">/</span>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `hover:text-gray-800 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              {label}
            </NavLink>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
