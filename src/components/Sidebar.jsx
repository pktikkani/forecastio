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
      label: "Home",
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
      path: "/outlets",
      label: "Outlets",
      icon: MdOutlineStore,
      activeIcon: MdStore,
    },
    {
      path: "/locations",
      label: "Location",
      icon: MdOutlineLocationOn,
      activeIcon: MdLocationOn,
    },
    {
      path: "/menu",
      label: "Menu",
      icon: MdOutlineRestaurantMenu,
      activeIcon: MdRestaurantMenu,
    },
  ];


  return (
    <>
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white/80 backdrop-blur-xl shadow-2xl transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-lg lg:bg-white/90
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col py-6">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Navigation</h2>
              <button
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full p-2 text-slate-400 hover:text-slate-600 lg:hidden"
                onClick={closeDrawer}
                aria-label="Close sidebar"
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
          </div>

          <nav className="mt-6 flex-1 space-y-1 px-2">
            {menuItems.map(
              ({ path, label, icon: Icon, activeIcon: ActiveIcon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeDrawer}
                  className={`group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${
                      isActive(path)
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {isActive(path) ? (
                    <ActiveIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Icon className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-600" aria-hidden="true" />
                  )}
                  {label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-25 lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
