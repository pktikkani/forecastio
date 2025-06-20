import React, { useState, useEffect } from "react";
import { createCustomer, updateCustomer, deleteCustomer } from "../services";
import { useAuth } from "../context/useAuth";
import { useCustomer } from "../context/useCustomers";

const CustomerPopup = ({ isOpen, onClose, data, type }) => {
  const { token } = useAuth();
  const { setCustomers } = useCustomer();

  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (type === "UPDATE" || ("DELETE" && data)) {
      setFormData({ name: data.name || "" });
    } else {
      setFormData({ name: "" });
    }
  }, [type, data]);

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
      const response =
        type === "UPDATE"
          ? await updateCustomer(token, data.id, formData)
          : await createCustomer(token, formData);

      if (response) {
        setCustomers((prevCustomers) =>
          type === "UPDATE"
            ? prevCustomers.map((c) => (c.id === data.id ? response : c))
            : [...prevCustomers, response]
        );
      }
      setFormData({ name: "" });
      onClose();
    } catch (err) {
      setError(
        err.message || type === "UPDATE"
          ? "Failed to update customer"
          : "Failed to create customer"
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
      setCustomers((prevCustomers) =>
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
              {type === "UPDATE" ? "Edit Customer" : "Create New Customer"}
            </h2>
            <form onSubmit={handleSubmit}>
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

export default CustomerPopup;
