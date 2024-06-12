import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { logout } from "../store/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/profile", formData);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/change-password", passwordData);
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Dashboard</h1>
      <form
        onSubmit={handleProfileSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Update Profile
        </button>
      </form>
      <form
        onSubmit={handlePasswordSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800  transition duration-200"
        >
          Change Password
        </button>
      </form>
      <div className=" text-center">
        {" "}
        <button
          onClick={handleLogout}
          className="w-[100px] bg-red-500 text-white p-2 rounded-sm hover:bg-red-600 transition duration-200 "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
