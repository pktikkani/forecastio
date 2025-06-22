import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./useAuth";
import { fetchLocationsForCustomer } from "../services";
import { useCustomer } from "./useCustomers";
const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const { token } = useAuth();
  const { customers } = useCustomer();
  const [selectedLocationList, setSelectedLocationList] = useState([]);
  const [location, setLocation] = useState();
  const [allLocations, setAllLocations] = useState([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const fetchData = async (customerId) => {
    if (!token) return;
    try {
      const response = await fetchLocationsForCustomer(token, customerId);
      if (response?.length > 0) {
        setSelectedLocationList(response);
      } else {
        setSelectedLocationList([]);
      }
      return response;
    } catch (error) {
      console.error(`Failed to fetch data for location ${location}:`, error);
      return [];
    }
  };

  const fetchAllLocations = async () => {
    if (!token || customers?.length <= 0) return;
    try {
      setIsLocationLoading(true);
      let all = [];
      for (const customer of customers) {
        const response = await fetchLocationsForCustomer(token, customer.id);
        if (response?.length > 0) {
          all = [...all, ...response];
        }
      }
      setAllLocations(all);
    } catch (error) {
      console.error(`Failed to fetch data for all locations:`, error);
      return [];
    } finally {
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    if (customers?.length > 0) {
      fetchData(customers[0]?.id);
      fetchAllLocations();
    }
  }, [token, customers]);

  const contextValue = {
    location,
    setLocation,
    isLocationLoading,
    selectedLocationList,
    setSelectedLocationList,
    fetchData,
    allLocations,
  };
  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
