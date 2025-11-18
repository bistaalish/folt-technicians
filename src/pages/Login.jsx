import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);

      if (data.access_token) {
        const expireAt = Date.now() + 15 * 60 * 1000;

        sessionStorage.setItem("token", data.access_token);
        sessionStorage.setItem("token_type", data.token_type);
        sessionStorage.setItem("expire_at", expireAt);

        navigate("/device");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f]">
      <div className="p-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl w-[350px] text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Technicians Login</h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">

          <input
            type="text"
            placeholder="Email"
            className="p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="mt-3 p-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
