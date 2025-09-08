import React, { useState } from "react";
import { FaBars, FaBell, FaSignOutAlt } from "react-icons/fa";
import { BiSolidFoodMenu } from "react-icons/bi";
import { IoStorefrontSharp } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { FaRegImages } from "react-icons/fa6";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { RiFileList3Fill } from "react-icons/ri";
import Breadcrumbs from "./Breadcrumbs";
import { BsFillHousesFill } from "react-icons/bs";

// ✅ Reusable color classes (change here to switch theme)
const primary = {
  text: "text-blue-600",
  bg: "bg-blue-600",
  hover: "hover:bg-blue-700",
  lightBg: "bg-blue-100",
  lightText: "text-blue-600",
};

const Sidebar = ({ handleLinkClick, onLogoutClick }) => {
  const links = [
    { path: "/admin/menu", label: "Menu's Add", icon: <BiSolidFoodMenu /> },
    { path: "/admin/menu-list", label: "Menu's List", icon: <RiFileList3Fill /> },
    {
      path: "/admin/franchises",
      label: "Franchises Add",
      icon: <IoStorefrontSharp />,
    },
    {
      path: "/admin/franchises-list",
      label: "Franchises List",
      icon: <BsFillHousesFill />,
    },
    { path: "/admin/gallery", label: "Gallery", icon: <GrGallery /> },
    {
      path: "/admin/franchises-image",
      label: "Franchise Images",
      icon: <FaRegImages />,
    },
  ];

  return (
    <nav className="space-y-4">
      {links.map((link, idx) => (
        <NavLink
          key={idx}
          to={link.path}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg font-medium ${
              isActive
                ? `${primary.lightBg} ${primary.lightText}`
                : `text-gray-700 hover:${primary.lightBg}`
            }`
          }
        >
          {link.icon} {link.label}
        </NavLink>
      ))}

      {/* ✅ Logout button at the bottom */}
      <button
        onClick={onLogoutClick}
        className="flex items-center gap-3 p-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 w-full"
      >
        <FaSignOutAlt /> Logout
      </button>
    </nav>
  );
};

const ResponsiveDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { logout } = useAuth();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${primary.text} mb-8`}>
              Dashboard
            </h1>
            <Sidebar
              handleLinkClick={handleLinkClick}
              onLogoutClick={() => setShowLogoutModal(true)}
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 fixed top-0 left-0 right-0 z-10 md:ml-64">
  <div className="flex items-center gap-4">
    <button
      onClick={toggleSidebar}
      className="text-gray-700 md:hidden focus:outline-none"
    >
      <FaBars size={24} />
    </button>

    {/* ✅ Breadcrumbs instead of static title */}
    <Breadcrumbs />
  </div>

  <div className="flex items-center gap-4">
    <div
      className={`${primary.lightBg} ${primary.lightText} px-3 py-1 rounded-full text-sm font-medium`}
    >
      Admin
    </div>
  </div>
</header>


        {/* Dynamic Content */}
        <main className="flex-1 mt-20 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className={`px-4 py-2 rounded-md ${primary.bg} text-white ${primary.hover}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveDashboard;
