import React from "react";
import {
  UsersIcon,
  DollarSignIcon,
  ReceiptIcon,
  BookOpenIcon,
  CalendarIcon,
} from "./ui/icons";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 h-full bg-gray-800 text-white w-[250px] z-20">
      <div className="flex flex-col items-center bg-gray-800 p-6 text-gray-50 text-[18px]">
        <NavLink to="/admin" className="flex items-center gap-2 py-4">
          <span className="text-lg font-bold">Gathering Church</span>
        </NavLink>
        <nav className="mt-8 flex flex-col items-start gap-4 w-full">
          <NavLink
            to="/admin/members"
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-4 w-full rounded-lg ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <UsersIcon className="h-5 w-5" />
            <span> Church Members</span>
          </NavLink>
          <NavLink
            to="/admin/offerings"
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-4 w-full rounded-lg ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <DollarSignIcon className="h-5 w-5" />
            <span>Offerings</span>
          </NavLink>
          <NavLink
            to="/admin/expenses"
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-4 w-full rounded-lg ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <ReceiptIcon className="h-5 w-5" />
            <span>Expenses</span>
          </NavLink>
          <NavLink
            to="/admin/sermons"
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-4 w-full rounded-lg ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>Sermons</span>
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-4 w-full rounded-lg ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Events</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
