import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => {
    return localStorage.getItem("token") || null;
  });
  const [email, setEmailState] = useState(() => {
    return localStorage.getItem("email") || null;
  });

  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const setEmailStore = (newEmail) => {
    setEmailState(newEmail);
    if (newEmail) {
      localStorage.setItem("email", newEmail);
    } else {
      localStorage.removeItem("email");
    }
  };

  const setAuth = ({ token, email }) => {
    setToken(token);
    setEmailStore(email);
  };

  const clearAuth = () => {
    setTokenState(null);
    setEmailState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ token, email, setToken, setEmailStore, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};