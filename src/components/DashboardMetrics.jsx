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
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          className="relative overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-xl ring-1 ring-white/20 cursor-pointer transition-all hover:shadow-2xl hover:scale-105 hover:bg-white/90"
          onClick={() => navigate("/outlets")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{customers?.length || 0}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
                <MdStore className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-xl ring-1 ring-white/20 cursor-pointer transition-all hover:shadow-2xl hover:scale-105 hover:bg-white/90"
          onClick={() => navigate("/locations")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <div className="mt-2">
                  {isLocationLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{allLocations?.length || 0}</p>
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
                <MdLocationOn className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-xl ring-1 ring-white/20 cursor-pointer transition-all hover:shadow-2xl hover:scale-105 hover:bg-white/90"
          onClick={() => navigate("/menu")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <div className="mt-2">
                  {isMenuLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{allMenusItems?.length || 0}</p>
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 shadow-lg">
                <MdRestaurantMenu className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
