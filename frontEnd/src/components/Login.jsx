import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Array of the image paths relative to the public folder
const loginImages = [
  '/recipe_1.png',
  '/recipe_2.png',
  '/recipe_3.png',
  '/recipe_4.png',
];

const baseURL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginUser(data);
        navigate("/");
      } else {
        alert("Login failed: " + (data.detail || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    // Add classes to the form container
    <div className="flex justify-center items-center p-4" style={{ height: 'calc(100vh - 72px)' }}> {/* 72px is approx height of navbar */}
      <div className="flex w-full max-w-6xl h-[70vh] bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left Side: The Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side: The Images */}
        <div className="hidden md:grid md:w-1/2 grid-cols-2 grid-rows-2 gap-2 p-2">
          {loginImages.map((imgSrc, index) => (
            <div key={index} className="overflow-hidden rounded-md">
              <img
                src={imgSrc}
                alt={`Login visual ${index + 1}`}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Login;
