import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Mail, FolderOpen, Calendar, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: <Mail className="w-5 h-5" />, label: "Inbox" },
    {
      path: "/dashboard/categories",
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Categories",
    },
    {
      path: "/dashboard/appointments",
      icon: <Calendar className="w-5 h-5" />,
      label: "Appointments",
    },
    // { path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="bg-white shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className=" ps-3 ">
          <img
            src="https://aisalesteams-bucket.s3.amazonaws.com/assets/aise+logo+black+text.png"
            alt="logo"
            className=" w-24 md:h-auto  duration-500 ease-in-out "
          ></img>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
