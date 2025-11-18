import React from "react";
import Topbar from "../components/Topbar";
import { Outlet, Link, useLocation } from "react-router-dom";

const DeviceLayout = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean); // split path and remove empty

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      {/* Right Side Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navigation Bar */}
        <Topbar />

        {/* Breadcrumb Navigation */}
        <div className="px-6 py-3 bg-[#1a1a1a] text-gray-300 text-sm">
          <Link to="/device" className="hover:text-green-500">
            Home
          </Link>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
              <span key={routeTo}>
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="text-white">{name}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-green-500">
                    {name}
                  </Link>
                )}
              </span>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DeviceLayout;
