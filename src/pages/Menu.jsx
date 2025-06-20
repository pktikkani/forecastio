import React, { useEffect, useState } from "react";
import { useMenu } from "../context/useMenu";
import { useLocation } from "../context/useLocation";
import MenuItemPopup from "../components/MenuItemPopup";
import { useCustomer } from "../context/useCustomers";
import { useAuth } from "../context/useAuth";

const Menu = () => {
  const { customers } = useCustomer();
  const { location, locationData, fetchData, selectedLocationList } =
    useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const { menu, menuLocation, setMenuLocation, fetchMenuData } = useMenu();

  const handleCustomerSelect = async (id) => {
    const customerLocation = await fetchData(id);
    if (customerLocation?.length > 0) {
      setMenuLocation(customerLocation[0]?.id);
      setSelectedCustomer(customerLocation[0]?.id)
    }
  };

  useEffect(() => {
    if (customers?.length > 0) {
      handleCustomerSelect(customers[0]?.id);
    }
  }, [customers]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Menu Management
              </h2>
              <p className="text-gray-500">
                Manage your restaurant&apos;s menu items{location?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {customers?.length > 0 && (
                <div className="flex items-center">
                  <label
                    htmlFor="location-select"
                    className="mr-2 text-gray-700 font-medium"
                  >
                    Outlets:
                  </label>
                  <select
                    id="location-select"
                    value={location}
                    onChange={(e) =>
                      handleCustomerSelect(Number(e.target.value))
                    }
                    className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    {customers?.length > 0 &&
                      customers.map((loc) => (
                        <option key={loc.id} value={loc?.id}>
                          {loc?.name} {loc?.city}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {selectedLocationList && (
                <div className="flex items-center">
                  <label
                    htmlFor="location-select"
                    className="mr-2 text-gray-700 font-medium"
                  >
                    Location:
                  </label>
                  <select
                    id="location-select"
                    value={menuLocation}
                    onChange={(e) => setMenuLocation(Number(e.target.value))}
                    className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    {selectedLocationList?.length > 0 &&
                      selectedLocationList.map((loc) => (
                        <option key={loc.id} value={loc?.id}>
                          {loc?.name} {loc?.city}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add New Item
              </button>
            </div>
          </div>

          {selectedLocationList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {menu?.length > 0 &&
                menu.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-medium text-black">
                      {item?.name}
                    </h3>
                    {/* <div className="flex justify-between items-center mt-2">
                    <div className="flex justify-end space-x-2 w-full">
                      <button>
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button>
                        <svg
                          className="w-4 h-4 text-gray-600"
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
                  </div> */}
                  </div>
                ))}
              {!menu && (
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-500">No menu items available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <MenuItemPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        locationId={menuLocation?.id}
        customers={customers}
        selectedCustomer={selectedCustomer}
        selectedLocationList={selectedLocationList}
        handleCustomerSelect={handleCustomerSelect}
        setMenuLocation={setMenuLocation}
        defaultCustomerId={customers?.[0]?.id}
        defaultLocationId={selectedLocationList?.[0]?.id}
      />
    </div>
  );
};

export default Menu;
