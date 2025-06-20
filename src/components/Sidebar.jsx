import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "../context/useDrawer";
import {
  MdDashboard,
  MdOutlineDashboard,
  MdRestaurantMenu,
  MdOutlineRestaurantMenu,
  MdStore,
  MdOutlineStore,
  MdLocationOn,
  MdOutlineLocationOn,
  MdSettings,
  MdOutlineSettings,
  MdLogout,
  MdOutlineLogout,
  MdPerson,
  MdOutlinePerson,
  MdOutlineAddchart,
  MdOutlineAnalytics,
  MdAnalytics,
  MdOutlineUploadFile,
  MdUploadFile,
} from "react-icons/md";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { clearAuth } = useAuth();
  const currentPath = location.pathname;
  const drawerRef = useRef(null);

  const { isDrawerOpen, closeDrawer } = useDrawer();
  const isActive = (path) => currentPath === path;

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        closeDrawer();
      }
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDrawerOpen, userMenuOpen]);

  const logOut = () => {
    clearAuth();
    setUserMenuOpen(false);
  };

  const menuItems = [
    {
      path: "/home",
      label: "Forcast",
      icon: MdOutlineAnalytics,
      activeIcon: MdAnalytics,
    },
    {
      path: "/trainModel",
      label: "Upload and Data",
      icon: MdOutlineUploadFile,
      activeIcon: MdUploadFile,
    },
    {
      path: "/menu",
      label: "Menu",
      icon: MdOutlineRestaurantMenu,
      activeIcon: MdRestaurantMenu,
    },
    {
      path: "/outlets",
      label: "Outlets",
      icon: MdOutlineStore,
      activeIcon: MdStore,
    },
    {
      path: "/location",
      label: "Location",
      icon: MdOutlineLocationOn,
      activeIcon: MdLocationOn,
    },
  ];


  return (
    <>
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out z-40 flex flex-col justify-between 
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:block
          ${isDrawerOpen ? "overflow-y-auto" : ""}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <button
              className="lg:hidden p-2 text-gray-700 focus:outline-none"
              onClick={closeDrawer}
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {menuItems.map(
              ({ path, label, icon: Icon, activeIcon: ActiveIcon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 p-2 rounded text-gray-700 text-sm sm:text-base
                    ${isActive(path) ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    onClick={closeDrawer}
                  >
                    {isActive(path) ? (
                      <ActiveIcon size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                    {label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[#0000009e] bg-opacity-50 z-30"
          onClick={closeDrawer}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
