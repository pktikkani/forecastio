import React, { useState } from "react";
import { useCustomer } from "../context/useCustomers";
import CustomerPopup from "../components/CustomerPopup";
import { Button } from "../components/ui/Button";
import { MdStore, MdLocationOn, MdEdit, MdDelete } from "react-icons/md";

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
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />
        <div className="relative p-8">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Outlets</h2>
              <p className="text-gray-600 mt-1">
                Manage your restaurant&apos;s outlets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="solid"
                color="blue"
              >
                <MdStore className="mr-2 h-4 w-4" />
                Add New Outlet
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {customers &&
              customers.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg ring-1 ring-white/20 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
                        <MdStore className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/50 hover:bg-white/70 text-gray-600 hover:text-blue-600"
                        >
                          <MdEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/50 hover:bg-white/70 text-gray-600 hover:text-red-600"
                        >
                          <MdDelete className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MdLocationOn className="h-4 w-4" />
                      <span>{item.city || "No location"}</span>
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
