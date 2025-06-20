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
      <div className="flex justify-between items-center bg-white shadow-md px-8 py-3">
        <div className="flex justify-start items-center">
          <button
            className="lg:hidden p-2 text-gray-700 bg-white focus:outline-none pr-6"
            onClick={toggleDrawer}
            aria-label="Toggle menu"
            aria-expanded={isDrawerOpen}
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
                d={
                  isDrawerOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
          {/* <h1 className="text-2xl font-bold text-gray-800">Forecast.io</h1> */}
        </div>
        <div className="flex items-center space-x-4 relative">
          <div className="flex items-center space-x-2 cursor-pointer" ref={dropdownRef}>
            <div
              onClick={handleToggleDropdown}
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold select-none"
              title="User menu"
            >
              {/* You can replace this with an actual image if you have one */}
              {email ? email.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-10 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleProfile}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {email}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
