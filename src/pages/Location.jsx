import React, { useEffect, useState } from "react";
import { useCustomer } from "../context/useCustomers";
import { useLocation } from "../context/useLocation";
import LocationPopup from "../components/LocationPopup";
import { Button } from "../components/ui/Button";
import { SelectField } from "../components/ui/TextField";
import { MdLocationOn, MdEdit, MdDelete, MdAdd } from "react-icons/md";

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
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />
        <div className="relative p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Locations
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your restaurant's locations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SelectField
                label="Select Outlet"
                id="location-select"
                value={selectedCustomerId}
                onChange={handleSelectCustomer}
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
              </SelectField>
              {customers?.length > 0 && (
                <Button
                  onClick={() => setIsOpen(true)}
                  variant="solid"
                  color="blue"
                >
                  <MdAdd className="mr-2 h-4 w-4" />
                  Add New Location
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(selectedLocationList) && selectedLocationList.length > 0 ? (
              selectedLocationList.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg ring-1 ring-white/20 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
                        <MdLocationOn className="h-6 w-6 text-white" />
                      </div>
                      <button
                        onClick={() => handleDelete(item)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/50 hover:bg-white/70 text-gray-600 hover:text-red-600"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
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
      </div>
      {isOpen && (
          <LocationPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
          />
        )}
      {isDeleteOpen && (
          <LocationPopup
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            data={selectedLocation}
            type="DELETE"
            customers={customers}
            selectedCustomerId={selectedCustomerId}
          />
        )}
      {isUpdateOpen && (
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
  );
}

export default Location;