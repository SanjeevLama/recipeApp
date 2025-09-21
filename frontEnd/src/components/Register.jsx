import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

// Array of the image paths relative to the public folder
const loginImages = [
  '/recipe_1.png',
  '/recipe_2.png',
  '/recipe_3.png',
  '/recipe_4.png',
];

const baseURL = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/register/`, {
        username, password, email,
      });

      const response = await axios.post(`${baseURL}/api/token/`, {
        username, password,
      });

      const tokenData = response.data;
      loginUser(tokenData);

      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const errorMessage = Object.keys(errorData).map(key => `${key}: ${errorData[key]}`).join(', ');
        setError(errorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.log("Registration error:", error);
    }
  };

  return (
    // Add classes to the form container
    <div className="flex justify-center items-center p-4" style={{ height: 'calc(100vh - 72px)' }}> {/* 72px is approx height of navbar */}
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left Side: The Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Create New Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display error message if it exists */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

            {/* Form fields for username, email, password, and confirm password */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
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

export default Register;
