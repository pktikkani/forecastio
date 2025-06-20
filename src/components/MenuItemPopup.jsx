import React, { useState, useEffect } from "react";
import { createCustomer, updateCustomer, deleteCustomer, createMenuItem } from "../services";
import { useAuth } from "../context/useAuth";
import { useCustomer } from "../context/useCustomers";
import { useMenu } from "../context/useMenu";

const MenuItemPopup = ({ 
  isOpen, 
  onClose, 
  data, 
  type, 
  locationId,
  customers,
  selectedLocationList,
  handleCustomerSelect,
  setMenuLocation,
  defaultCustomerId,
  defaultLocationId,
  selectedCustomer
}) => {
  const { token } = useAuth();
  const { menu, menuLocation, setMenu } = useMenu();

  const [formData, setFormData] = useState({ 
    name: "",
    customerId: selectedCustomer || defaultCustomerId,
    locationId: setMenuLocation || defaultLocationId
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (type === "UPDATE" || ("DELETE" && data)) {
      setFormData({ 
        name: data.name || "",
        customerId: defaultCustomerId,
        locationId: defaultLocationId
      });
    } else {
      setFormData({ 
        name: "",
        customerId: defaultCustomerId,
        locationId: defaultLocationId
      });
    }
  }, [type, data, defaultCustomerId, defaultLocationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.name.length > 100) {
      setError("Name must be less than 100 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await createMenuItem(token, formData.locationId, formData);
      if (response && String(menuLocation) === formData.locationId) {
        setMenu((prevCustomers) =>
          type === "UPDATE"
            ? prevCustomers.map((c) => (c.id === data.id ? response : c))
            : [...prevCustomers, response]
        );
      }
      setFormData({ 
        name: "",
        customerId: defaultCustomerId,
        locationId: defaultLocationId
      });
      onClose();
    } catch (err) {
      setError(
        err.message || type === "UPDATE"
          ? "Failed to update menu item"
          : "Failed to create menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteCustomer(token, data.id);
      setMenu((prevCustomers) =>
        prevCustomers.filter((c) => c.id !== data.id)
      );
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete customer");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0000009e] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {type === "DELETE" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete {data.name}? This action cannot be
              undone.
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {type === "UPDATE" ? "Edit Menu" : "Add New Menu"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <select
                  id="customer"
                  name="customerId"
                  value={formData.customerId}
                  onChange={(e) => {
                    handleCustomerSelect(Number(e.target.value));
                    handleChange(e);
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {customers?.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  id="location"
                  name="locationId"
                  value={formData.locationId}
                  onChange={(e) => {
                    setMenuLocation(Number(e.target.value));
                    handleChange(e);
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {selectedLocationList?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} {location.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {type === "UPDATE"
                    ? loading
                      ? "Updating..."
                      : "Update"
                    : loading
                    ? "Creating..."
                    : "Create"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuItemPopup;
