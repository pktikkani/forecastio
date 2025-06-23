import React, { useState, useRef, useEffect } from "react";
import { useDrawer } from "../context/useDrawer";
import { useAuth } from "../context/useAuth";

const Header = () => {
  const { email, logout } = useAuth(); // Assuming logout is provided by useAuth
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const { clearAuth } = useAuth();


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleProfile = () => {
    setDropdownOpen(false);
  };


  const handleLogout = () => {
      clearAuth();
  };

  

  return (
    <>
      <header className="relative z-50 flex items-center justify-between bg-white/70 backdrop-blur-xl px-4 py-5 shadow-lg shadow-slate-900/5 sm:px-6 lg:px-8 border-b border-white/20">
        <div className="flex items-center gap-x-4">
          <button
            className="relative z-10 flex h-8 w-8 items-center justify-center lg:hidden"
            onClick={toggleDrawer}
            aria-label="Toggle navigation"
            aria-expanded={isDrawerOpen}
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path
                d="M0 1H14M0 7H14M0 13H14"
                className={
                  isDrawerOpen
                    ? "scale-90 opacity-0 transition origin-center"
                    : "transition origin-center"
                }
              />
              <path
                d="M2 2L12 12M12 2L2 12"
                className={
                  !isDrawerOpen
                    ? "scale-90 opacity-0 transition origin-center"
                    : "transition origin-center"
                }
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Forecastio</h1>
        </div>
        <div className="flex items-center gap-x-5">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleToggleDropdown}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              title="User menu"
            >
              {email ? email.charAt(0).toUpperCase() : "U"}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  {email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
