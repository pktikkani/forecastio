import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./useAuth";
import { fetchMenuItems } from "../services";
import { useCustomer } from "./useCustomers";

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const { token } = useAuth();
  const [menu, setMenu] = useState([]);
  const [menuLocation, setMenuLocation] = useState();

  const fetchMenuData = async () => {
    if (!token ) return;
    try {
      const response = await fetchMenuItems(token, menuLocation);
      setMenu(response);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  useEffect(() => {
    if(token && menuLocation ){
      fetchMenuData()
    }
  },[token, menuLocation])

  return (
    <MenuContext.Provider value={{ menu, menuLocation, setMenuLocation,setMenu, fetchMenuData }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
