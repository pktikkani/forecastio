import React, { useState, useEffect } from "react";
import { createLocation, deleteLocation } from "../services";
import { useAuth } from "../context/useAuth";
import { useLocation } from "../context/useLocation";

const LocationPopup = ({
  isOpen,
  onClose,
  data,
  type,
  customers,
  selectedCustomerId,
}) => {
  const { token } = useAuth();
  const { selectedLocationList, setSelectedLocationList } = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    timezone: "US/Central",
    customer_id: customers?.[0]?.id || selectedCustomerId || "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const timezoneOptions = [
    { value: "US/Central", label: "Central Time (US/Central)" },
    { value: "US/Eastern", label: "Eastern Time (US/Eastern)" },
    { value: "US/Mountain", label: "Mountain Time (US/Mountain)" },
    { value: "US/Pacific", label: "Pacific Time (US/Pacific)" },
    { value: "US/Alaska", label: "Alaska Time (US/Alaska)" },
    { value: "US/Hawaii", label: "Hawaii Time (US/Hawaii)" },
  ];

  useEffect(() => {
    if (type === "DELETE" || data) {
      setFormData({
        name: data.name || "",
        city: data.city || "",
        timezone: data.timezone || "US/Central",
        customer_id:
          data.customer_id || selectedCustomerId || customers?.[0]?.id || "",
      });
    } else {
      setFormData({
        name: "",
        city: "",
        timezone: "US/Central",
        customer_id: selectedCustomerId || customers?.[0]?.id || "",
      });
    }
  }, [type, data, customers, isOpen, selectedCustomerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
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
    if (!formData.city.trim()) {
      setError("City is required");
      return false;
    }
    if (formData.city.length > 100) {
      setError("City must be less than 100 characters");
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
      const response = await createLocation(token, formData);
      if (response && selectedCustomerId === formData.customer_id) {
        setSelectedLocationList((prev) => [...prev, response]);
      }
      setFormData({
        name: "",
        city: "",
        timezone: "US/Central",
        customer_id: customers[0]?.id || "",
      });
      onClose();
    } catch (err) {
      setError("Failed to create location");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteLocation(token, data.id);
      setSelectedLocationList((prevLocations) => {
        if (!Array.isArray(prevLocations)) {
          console.error("selectedLocationList is not an array:", prevLocations);
          return [];
        }
        return prevLocations.filter((loc) => loc.id !== data.id);
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete location");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                onClick={onClose}
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
              {type === "UPDATE" ? "Edit Location" : "Add New Location"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="customer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer
                </label>
                <select
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
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
              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {timezoneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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

export default LocationPopup;
