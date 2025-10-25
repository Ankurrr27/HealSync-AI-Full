import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [customId, setCustomId] = useState(null);
  const [role, setRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.custom_id) {
      setCustomId(user.custom_id);
      setRole(user.role);
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
    "text-sm sm:text-base text-gray-700 font-medium px-2 sm:px-3 py-1 sm:py-2 rounded-full transition duration-300 hover:text-indigo-700 hover:bg-indigo-50";

  return (
    <nav className="bg-white shadow border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 sticky top-0 z-50 rounded-b-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 cursor-pointer">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
            <span className="text-gray-900">Heal</span>
            <span className="text-indigo-600">Sync</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        {!isAuthPage && customId && role && (
          <div className="hidden lg:flex flex-grow justify-center space-x-1 lg:space-x-3 max-w-3xl text-sm">
            <Link to={`/${role}/${customId}/`} className={navLinkClass}>Dashboard</Link>
            {role === "patient" && (
              <Link to={`/${role}/${customId}/records`} className={navLinkClass}>
                Records
              </Link>
            )}
            <Link to={`/${role}/${customId}/appointments`} className={navLinkClass}>Appointments</Link>
            <Link className={navLinkClass}>AI</Link>
          </div>
        )}

        {/* Auth / Profile / Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAuthPage ? (
            <div className="hidden sm:flex space-x-2 sm:space-x-3 text-sm">
              <Link
                to="/login"
                className="px-4 sm:px-6 py-1 sm:py-2 font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 shadow-lg transform hover:scale-[1.03]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 sm:px-6 py-1 sm:py-2 font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 ring-1 ring-gray-300 transform hover:scale-[1.03]"
              >
                Signup
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden lg:flex items-center space-x-2 sm:space-x-4">
                <button
                  className="text-gray-600 hover:text-indigo-700 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition duration-200 relative"
                  title="Notifications"
                >
                  <BellIcon className="w-5 sm:w-6 h-5 sm:h-6" />
                  <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                </button>
                <Link
                  to={`/${role}/${customId}/profile`}
                  className="text-gray-600 hover:text-indigo-700 p-1 sm:p-2 rounded-full transition duration-200 flex items-center space-x-1"
                  title="My Profile"
                >
                  <UserCircleIcon className="w-6 sm:w-7 h-6 sm:h-7" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 sm:space-x-2 bg-red-500 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-600 transition duration-300 shadow-md transform hover:translate-y-[-1px]"
                >
                  <ArrowRightOnRectangleIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>

              {/* Mobile toggle */}
              <button
                className="lg:hidden p-1 sm:p-2 rounded-md text-gray-600 hover:text-indigo-700 hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && !isAuthPage && customId && role && (
        <div className="lg:hidden mt-2 space-y-1 px-2 pb-3 text-sm">
          <Link to={`/${role}/${customId}/`} className={navLinkClass}>Dashboard</Link>
          {role === "patient" && (
            <Link to={`/${role}/${customId}/records`} className={navLinkClass}>Records</Link>
          )}
          <Link to={`/${role}/${customId}/appointments`} className={navLinkClass}>Appointments</Link>
          <Link className={navLinkClass}>AI</Link>

          <div className="flex flex-col space-y-1 mt-2">
            <Link to={`/${role}/${customId}/profile`} className={navLinkClass}>Profile</Link>
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
