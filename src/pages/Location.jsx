import React, { useEffect, useState } from "react";
import { useCustomer } from "../context/useCustomers";
import { useLocation } from "../context/useLocation";
import LocationPopup from "../components/LocationPopup";

const Location = () => {
  const { selectedLocationList, fetchData } = useLocation();
  const { customers } = useCustomer();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(""); 
  const [selectedLocation, setSelectedLocation] = useState(null); 

  useEffect(() => {
    if (customers?.length > 0) {
      setSelectedCustomerId(customers[0]?.id);
      fetchData(customers[0]?.id);
    }
  }, [customers]);

  const handleSelectCustomer = (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    fetchData(Number(customerId)); 
  };

  const handleDelete = (location) => {
    setSelectedLocation(location);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Locations
              </h2>
              <p className="text-gray-500">
                Manage your restaurant's location
              </p>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="location-select"
                className="mr-2 text-gray-700 font-medium"
              >
                Outlets:
              </label>
              <select
                id="location-select"
                value={selectedCustomerId}
                onChange={handleSelectCustomer}
                className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              >
                {customers?.length > 0 ? (
                  customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                     {customer.name} {customer.city}
                    </option>
                  ))
                ) : (
                  <option value="">No outlets available</option>
                )}
              </select>
            </div>
            {customers?.length > 0 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Add New Location
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(selectedLocationList) && selectedLocationList.length > 0 ? (
              selectedLocationList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.city}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.timezone}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-4 space-x-2">
                    {/* <button
                      onClick={() => handleUpdate(item)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                      title="Edit location"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-5.657 1.414 1.414-5.657L15.414 3.586z"
                        />
                      </svg>
                    </button> */}
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                      title="Delete location"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-4">
                <p className="text-gray-500">
                  No locations available. Create{" "}
                  {customers?.length === 0 ? "an outlet" : "a location"} to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>
        {isOpen > 0 && (
          <LocationPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
          />
        )}
        {isDeleteOpen > 0 && (
          <LocationPopup
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            data={selectedLocation}
            type="DELETE"
            customers={customers}
            selectedCustomerId={selectedCustomerId}
          />
        )}
        {isUpdateOpen > 0 && (
          <LocationPopup
            isOpen={isUpdateOpen}
            onClose={() => setIsUpdateOpen(false)}
            data={selectedLocation}
            type="UPDATE"
            customers={customers}
            selectedCustomerId={selectedCustomerId}
          />
        )}
      </div>
    </div>
  );
};

export default Location;