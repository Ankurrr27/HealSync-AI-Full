import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const [customId, setCustomId] = useState(null);
  const [role, setRole] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.custom_id) {
      setCustomId(user.custom_id);
      setRole(user.role);

      if (user.profilePic) {
        setProfilePic(user.profilePic);
      } else {
        fetchProfilePic(user.custom_id, user.role, user);
      }
    }
  }, []);

  const fetchProfilePic = async (custom_id, role, user) => {
    try {
      const apiUrl =
  role === "doctor"
    ? `${API_BASE}/doctor/${custom_id}`
    : `${API_BASE}/profile/${custom_id}`;

      const res = await axios.get(apiUrl);
      const data = res.data;

      if (data?.profile_image) {
        const imgUrl = data.profile_image.startsWith("http")
          ? data.profile_image
          : `${API_BASE.replace('/api', '')}/${data.profile_image}`
;
        setProfilePic(imgUrl);
        localStorage.setItem("user", JSON.stringify({ ...user, profilePic: imgUrl }));
      } else {
        setProfilePic(null);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePic(null);
    }
  };

 const handleLogout = () => {
  localStorage.removeItem("token");
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = () => {
    window.location.href = "/";
  };
  window.location.href = "/login"; // or navigate("/login")
};


  const authPaths = ["/", "/login", "/signup"];
  const isAuthPage = authPaths.includes(location.pathname);

  const navLinkClass =
    "block text-sm text-gray-700 font-medium px-3 py-2 rounded-md hover:text-indigo-600 hover:bg-indigo-50 transition duration-300";

  return (
    <nav className="bg-white shadow border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-2 sticky top-0 z-50 rounded-b-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 cursor-pointer">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-gray-900">Heal</span>
            <span className="text-blue-400">Sync</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        {!isAuthPage && customId && role && (
          <div className="hidden lg:flex flex-grow justify-center space-x-3 text-sm">
            <Link to={`/${role}/${customId}/`} className={navLinkClass}>
              Dashboard
            </Link>
            {role === "patient" && (
              <Link to={`/${role}/${customId}/records`} className={navLinkClass}>
                Records
              </Link>
            )}
            <Link to={`/${role}/${customId}/appointments`} className={navLinkClass}>
              Appointments
            </Link>
            <Link to={`/${role}/${customId}/ai`} className={navLinkClass}>
              AI
            </Link>
            {role === "patient" && (
              <Link to={`/${role}/${customId}/posturecorrector`} className={navLinkClass}>
                Posture Corrector
              </Link>
            )}
          </div>
        )}

        {/* Auth Buttons / Profile */}
        <div className="flex items-center space-x-3">
          {isAuthPage ? (
            <div className="hidden sm:flex space-x-3 text-sm">
              <Link
                to="/login"
                className="px-4 py-2 font-semibold rounded-full bg-blue-400 text-white hover:bg-blue-500 transition duration-300 shadow-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 ring-1 ring-gray-300"
              >
                Signup
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to={`/${role}/${customId}/notification`}
                  className="text-gray-600 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 relative"
                  title="Notifications"
                >
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                </Link>

                <Link
                  to={`/${role}/${customId}/profile`}
                  className="p-1 rounded-full hover:ring-2 hover:ring-indigo-200 transition"
                  title="Profile"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 text-sm">
                      ?
                    </div>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 shadow-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Mobile Toggle (Always Visible) */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-400 hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && !isAuthPage && customId && role && (
        <div className="absolute right-4 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-xl p-3 flex flex-col items-start space-y-1 text-sm">
          <Link to={`/${role}/${customId}/`} className={navLinkClass}>
            Dashboard
          </Link>
          {role === "patient" && (
            <Link to={`/${role}/${customId}/records`} className={navLinkClass}>
              Records
            </Link>
          )}
          <Link to={`/${role}/${customId}/appointments`} className={navLinkClass}>
            Appointments
          </Link>
          <Link to={`/${role}/${customId}/ai`} className={navLinkClass}>
            AI
          </Link>
          {role === "patient" && (
            <Link to={`/${role}/${customId}/notification`} className={navLinkClass}>
              Notification
            </Link>
          )}
          <hr className="w-full border-gray-200 my-1" />
          <Link to={`/${role}/${customId}/profile`} className={navLinkClass}>
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Auth Buttons for Welcome Page */}
      {mobileOpen && isAuthPage && (
        <div className="absolute right-4 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-xl p-3 flex flex-col items-start space-y-2 text-sm">
          <Link
            to="/login"
            className="w-full text-center px-4 py-2 font-semibold rounded-full bg-blue-400 text-white hover:bg-blue-500 transition duration-300 shadow-md"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full text-center px-4 py-2 font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 ring-1 ring-gray-300"
            onClick={() => setMobileOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
