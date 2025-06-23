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
    <div className="flex h-screen flex-col">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
      </div>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
