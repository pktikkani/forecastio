import React from "react";
import { useCustomer } from "../context/useCustomers";
import { useLocation } from "../context/useLocation";
import { useMenu } from "../context/useMenu";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdOutlineDashboard,
  MdRestaurantMenu,
  MdOutlineRestaurantMenu,
  MdStore,
  MdOutlineStore,
  MdLocationOn,
  MdUploadFile,
} from "react-icons/md";

const DashboardMetrics = () => {
  const { customers } = useCustomer();
  const { allLocations, isLocationLoading } = useLocation();
  const { allMenusItems, isMenuLoading } = useMenu();
  const navigate = useNavigate();

  return (
    <div className="w-full mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 pb-6">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate("/outlets")}
        >
          <div className="space-y-3 flex justify-between">
            <div className="">
              <div className="text-5xl font-bold text-gray-900">
                {customers?.length}
              </div>
              <h3 className="text-sm font-medium text-gray-600 leading-tight mt-4">
                Customers
              </h3>
            </div>
            <div className="flex items-baseline gap-3">
              <MdStore color="green" size={40} />
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate("/locations")}
        >
          <div className="space-y-3 flex justify-between">
            <div className="">
              <div className="text-5xl font-bold text-gray-900">
                {isLocationLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                ) : (
                  allLocations?.length
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 leading-tight mt-4">
                Locations
              </h3>
            </div>
            <div className="flex items-baseline gap-3">
              <MdLocationOn color="green" size={40} />
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate("/menu")}
        >
          <div className="space-y-3 flex justify-between">
            <div className="">
              <div className="text-5xl font-bold text-gray-900">
                {isMenuLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                ) : (
                  allMenusItems?.length
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 leading-tight mt-4">
                Menu Items
              </h3>
            </div>
            <div className="flex items-baseline gap-3">
              <MdRestaurantMenu color="green" size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
