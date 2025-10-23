import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [customId, setCustomId] = useState(null);
  const [role, setRole] = useState(null); // store user role
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.custom_id) {
      setCustomId(user.custom_id);
      setRole(user.role); // fetch role from user object
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCustomId(null);
    setRole(null);
    window.location.href = "/login";
  };

  const authPaths = ["/", "/login", "/signup"];
  const isAuthPage = authPaths.includes(location.pathname);

  const navLinkClass =
    "text-base text-gray-700 font-medium px-3 py-2 mx-1 rounded-full transition duration-300 hover:text-indigo-700 hover:bg-indigo-50";

  return (
    <nav className="bg-white shadow-2xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-50 rounded-b-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 cursor-pointer">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-gray-900">Heal</span>
            <span className="text-indigo-600">Sync</span>
          </h1>
        </Link>

        {/* Links for Logged-In Users */}
        <div className="flex-grow flex justify-center items-center max-w-3xl">
          {!isAuthPage && customId && role && (
            <div className="flex space-x-1 lg:space-x-3">
              <Link to={`/${role}/${customId}/`} className={navLinkClass}>
                Dashboard
              </Link>

              {/* Show Medical Records only for patients */}
              {role === "patient" && (
                <Link to={`/${role}/${customId}/records`} className={navLinkClass}>
                  Medical Records
                </Link>
              )}

              <Link to={`/${role}/${customId}/appointments`} className={navLinkClass}>
                Appointments
              </Link>

              <Link className={navLinkClass}>Heal Sync AI</Link>
            </div>
          )}
        </div>

        {/* Auth Buttons or Profile/Logout */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {isAuthPage ? (
            <div className="space-x-3">
              <Link
                to="/login"
                className="px-6 py-2 font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 shadow-lg transform hover:scale-[1.03]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 ring-1 ring-gray-300 transform hover:scale-[1.03]"
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                className="text-gray-600 hover:text-indigo-700 p-2 rounded-full hover:bg-gray-100 transition duration-200 relative"
                title="Notifications"
              >
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
              </button>

              {/* Profile */}
              <Link
                to={`/${role}/${customId}/profile`}
                className="text-gray-600 hover:text-indigo-700 p-2 rounded-full transition duration-200 flex items-center space-x-1"
                title="My Profile"
              >
                <UserCircleIcon className="w-7 h-7" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 shadow-md transform hover:translate-y-[-1px]"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
