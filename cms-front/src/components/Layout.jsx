import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Navbar2 from "./Navbar2";

const Layout = () => {
  return (
    <div className="flex h-screen w-full">
      <Navbar2 />
      <div className="flex flex-row flex-1 pt-16">
        <Navbar />
        <div className="flex-1 bg-gray-200 p-6 ml-[250px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;