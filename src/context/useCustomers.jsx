import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchCustomers } from "../services";
import { useAuth } from "./useAuth";

const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState(null);

  const fetchData = async () => {
    if (!token) return;
    const response = await fetchCustomers(token);
    setCustomers(response);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <CustomerContext.Provider value={{ customers, setCustomers, fetchData }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
