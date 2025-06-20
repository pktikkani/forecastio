import React, { useState } from "react";
import { useCustomer } from "../context/useCustomers";
import CustomerPopup from "../components/CustomerPopup";

const Customer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setISDeleteOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] =  useState({})
  const { customers } = useCustomer();

  const handleDelete = (data) => {
    setSelectedCustomer(data)
    setISDeleteOpen(true)
  }
  const handleUpdate = (data) => {
    setSelectedCustomer(data)
    setIsUpdateOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Outlets</h2>
              <p className="text-gray-500">
                Manage your restaurant&apos;s outlets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add New Outlet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {customers &&
              customers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg shadow p-4"
                >
                  <h3 className="text-lg font-medium text-black">
                    {item.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex justify-end space-x-2 w-full">
                      <button onClick={() => handleUpdate(item)}>
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
                      <button onClick={() => handleDelete(item)}>
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
                  </div>
                </div>
              ))}
            {customers?.length == 0 && (
              <div className="col-span-full text-center py-4">
                <p className="text-gray-500">No outlets available, Create a Outlet to get started</p>
              </div>
            )}
          </div>


        </div>
      </div>
      <CustomerPopup isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}/>
      <CustomerPopup isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(!isUpdateOpen)} data={selectedCustomer} type={"UPDATE"}/>
      <CustomerPopup isOpen={isDeleteOpen} onClose={() => setISDeleteOpen(!isDeleteOpen)} data={selectedCustomer} type={"DELETE"}/>
    </div>
  );
};

export default Customer;
