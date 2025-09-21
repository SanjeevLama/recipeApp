// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from '../api'; // Import our api instance

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authToken")
      ? jwtDecode(JSON.parse(localStorage.getItem("authToken")).access)
      : null
  );

  const loginUser = (tokens) => {
    setAuthToken(tokens);
    setUser(jwtDecode(tokens.access));
    localStorage.setItem("authToken", JSON.stringify(tokens));
    // Also set the default header for the api instance
    api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
  };

  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    // Remove the default header
    delete api.defaults.headers.common['Authorization'];
  };

  // This effect will listen for changes to localStorage from other tabs or our interceptor
  useEffect(() => {
      const handleStorageChange = () => {
          const tokenItem = localStorage.getItem('authToken');
          if (tokenItem) {
              const parsedToken = JSON.parse(tokenItem);
              setAuthToken(parsedToken);
              setUser(jwtDecode(parsedToken.access));
              api.defaults.headers.common['Authorization'] = `Bearer ${parsedToken.access}`;
          }
      };

      // The 'storage' event is a standard browser event
      window.addEventListener('storage', handleStorageChange);
      
      // Cleanup the listener when the component unmounts
      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };
  }, []);


  const contextData = {
    user,
    authToken,
    loginUser,
    // We don't need to export registerUser from here as it's a public action
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}