import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Do you really want to logout?")){
      logoutUser();
    navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        {/* Left side: Logo/Home Link */}
        <div className="text-xl font-bold">
          <Link to="/" className="text-gray-800 hover:text-blue-600">RecipeApp</Link>
        </div>

        {/* Right side: Links and User Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">My Profile</Link>
              <Link to="/create-recipe" className="text-gray-600 hover:text-blue-600">Create Recipe</Link>
              <span className="text-gray-800">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
