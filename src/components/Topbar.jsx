import React, { useState } from "react";
import { logout } from "../utils/auth";
import { Link } from "react-router-dom";

const Topbar = () => {
  const token = sessionStorage.getItem("token");
  
  // decode token
  let username = "User";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    username = payload.sub || "User";
  } catch {}

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#111] border-b border-gray-800 p-4 flex justify-between items-center shadow-md">
      {/* Welcome text */}
      <Link to="/dashboard">
      <h1 className="text-xl font-semibold">
        Welcome, <span className="text-green-400">{username}</span>!
      </h1>
      </Link>
      {/* Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setOpen(!open)}
          className="bg-[#222] px-4 py-2 rounded hover:bg-[#333]"
        >
          Profile ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-[#111] border border-gray-700 rounded shadow-lg w-40">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 hover:bg-red-600 text-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Topbar;
