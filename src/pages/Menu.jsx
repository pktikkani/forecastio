import React, { useEffect, useState } from "react";
import { useMenu } from "../context/useMenu";
import { useLocation } from "../context/useLocation";
import MenuItemPopup from "../components/MenuItemPopup";
import { useCustomer } from "../context/useCustomers";
import { Button } from "../components/ui/Button";
import { SelectField } from "../components/ui/TextField";
import { MdRestaurantMenu, MdAdd } from "react-icons/md";

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
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />
        <div className="relative p-8">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Menu Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your restaurant&apos;s menu items
              </p>
            </div>
            <div className="flex items-center gap-4">
              {customers?.length > 0 && (
                <div className="flex items-center">
                  <label
                    htmlFor="outlet-select"
                    className="mr-2 text-gray-700 font-medium"
                  >
                    Outlet:
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menu?.length > 0 &&
                menu.map((item, index) => {
                  const gradients = [
                    'from-orange-400/10 to-red-600/10',
                    'from-blue-400/10 to-indigo-600/10',
                    'from-green-400/10 to-emerald-600/10',
                    'from-purple-400/10 to-pink-600/10',
                    'from-yellow-400/10 to-orange-600/10',
                    'from-teal-400/10 to-cyan-600/10'
                  ];
                  const iconGradients = [
                    'from-orange-500 to-red-600',
                    'from-blue-500 to-indigo-600',
                    'from-green-500 to-emerald-600',
                    'from-purple-500 to-pink-600',
                    'from-yellow-500 to-orange-600',
                    'from-teal-500 to-cyan-600'
                  ];
                  const gradient = gradients[index % gradients.length];
                  const iconGradient = iconGradients[index % iconGradients.length];
                  
                  return (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg ring-1 ring-white/20 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`rounded-lg bg-gradient-to-br ${iconGradient} p-3 shadow-lg`}>
                            <MdRestaurantMenu className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item?.name}
                        </h3>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-600">Active</span>
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              {(!menu || menu.length === 0) && (
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
        setSelectedCustomer={setSelectedCustomer}
        setMenuLocation={setMenuLocation}
        defaultCustomerId={customers?.[0]?.id}
        defaultLocationId={selectedLocationList?.[0]?.id}
      />
    </div>
  );
};

export default Menu;
