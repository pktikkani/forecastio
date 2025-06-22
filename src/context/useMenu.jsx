import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./useAuth";
import { fetchMenuItems } from "../services";
import { useLocation } from "./useLocation";

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const { token } = useAuth();
  const { allLocations } = useLocation();
  const [menu, setMenu] = useState([]);
  const [menuLocation, setMenuLocation] = useState();
  const [allMenusItems, setAllMenusItems] = useState([]);
  const [isMenuLoading, setIsMenuLoading] = useState(false);

  const fetchMenuData = async () => {
    if (!token) return;
    try {
      const response = await fetchMenuItems(token, menuLocation);
      setMenu(response);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const fetchAllmenus = async () => {
    if (!token || allLocations?.length <= 0) return;
    try {
      setIsMenuLoading(true);
      let all = [];
      for (const location of allLocations) {
        const response = await fetchMenuItems(token, location.id);
        if (response?.length > 0) {
          all = [...all, ...response];
        }
      }
      setAllMenusItems(all);
    } catch (error) {
      console.error(`Failed to fetch data for all locations:`, error);
      return [];
    } finally {
      setIsMenuLoading(false);
    }
  };

  useEffect(() => {
    if (token && menuLocation) {
      fetchMenuData();
    }
  }, [token, menuLocation]);

  useEffect(() => {
    if (allLocations?.length > 0) {
      fetchAllmenus();
    }
  }, [allLocations]);

  return (
    <MenuContext.Provider
      value={{
        menu,
        isMenuLoading,
        menuLocation,
        setMenuLocation,
        setMenu,
        fetchMenuData,
        allMenusItems,
      }}
    >
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
