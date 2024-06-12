import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pageTitles = {
    "/admin/members": "Church Members",
    "/admin/tithes": "Tithes",
    "/admin/expenses": "Expenses",
    "/admin/sermons": "Sermons",
    "/admin/events": "Events",
  };

  const currentPage = pageTitles[location.pathname] || "Home";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
    setDropdownOpen(false);
  };

  const handleChangePasswordClick = () => {
    navigate("/admin/change-password");
    setDropdownOpen(false);
  };

  return (
    <div className="w-full bg-gray-800 fixed top-0 left-0 z-20 flex items-center justify-between p-4">
      <span className="text-xl font-bold ml-[250px] text-white">
        {currentPage}
      </span>
      <div className="relative">
        <img
          src="profile-pic-url" // Replace with actual profile picture URL
          alt="Profile"
          className="h-10 w-10 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-30">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              onClick={handleProfileClick}
            >
              Edit Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar2;
