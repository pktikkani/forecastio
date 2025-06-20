import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function AppLayout({ children }) {
  const navigate = useNavigate();
  const {token} = useAuth()
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  },[navigate])

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header />
      <div className="flex-1 flex justify-start">
        <Sidebar />
        <div className="w-full !overflow-scroll">{children}</div>
      </div>
    </div>
  );
}

export default AppLayout;
