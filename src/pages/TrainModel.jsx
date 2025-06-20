import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { bulkUploadDatapoints, forecast, trainModel } from "../services";
import { useMenu } from "../context/useMenu";
import { useCustomer } from "../context/useCustomers";
import { useLocation } from "../context/useLocation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AiAnimation from "../components/AiAnimation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrainModel = () => {
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const { customers } = useCustomer();
  const { location, fetchData, selectedLocationList } = useLocation();

  const { menu, menuLocation, setMenuLocation, fetchMenuData } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState();
  const [forecastData, setForecastData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dateRange, setDateRange] = useState("1Day");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const getForcastData = async () => {
    if (!selectedMenu) {
      alert("Please select menu");
      return;
    }
    setIsLoading(true);

    const location_id = menuLocation;
    const menu_id = selectedMenu;
    try {
      const trainRes = await trainModel(token, location_id, menu_id);
      console.log(trainRes, "trainRes");
      if (trainRes.sucess === false) {
        alert(`No data found, please upload data for selected menu`);
        return;
      }
      const days = dateRange.replace(/[^0-9]/g, "");
      const res = await forecast(token, location_id, menu_id, days);
      setForecastData(res);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for Chart.js
  const chartData = React.useMemo(() => {
    if (!forecastData || forecastData.length === 0) return null;

    const labels = forecastData.map((item) =>
      new Date(item.date).toLocaleDateString()
    );
    const data = forecastData.map((item) =>
      item.pred_value === "Cannot predict" ? null : Number(item.pred_value)
    );

    return {
      labels,
      datasets: [
        {
          label: "Forecast",
          data,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          spanGaps: false,
        },
      ],
    };
  }, [forecastData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Sales Forecast",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sales Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  const handleCustomerSelect = async (id) => {
    setSelectedCustomer(id);
    const customerLocation = await fetchData(id);
    if (customerLocation?.length > 0) {
      setMenuLocation(customerLocation[0]?.id);
    }
  };

  useEffect(() => {
    if (customers?.length > 0) {
      handleCustomerSelect(customers[0]?.id);
    }
  }, [customers]);

  const handleBulkUpload = async (file) => {
    if (!file) return;
    if (!selectedCustomer || !menuLocation || !selectedMenu) {
      alert("Please Select  Outlet or Location or Menu Item");
      return;
    }

    setIsUploading(true);
    setUploadComplete(false);

    // Read file as Base64
    const toBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64Content = await toBase64(file);
      const payload = {
        content: base64Content,
        customer_id: selectedCustomer,
        location_id: menuLocation,
        menu_id: selectedMenu,
      };
      const res = await bulkUploadDatapoints(token, payload);
      setUploadComplete(true);
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
      alert(
        `Failed to upload file: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "csv") {
      alert("Only CSV files are allowed.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    handleBulkUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!selectedMenu) {
      alert("Please select the menu item");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const trainUploadedData = async () => {
    setIsTraining(true);
    setIsLoading(true);

    const location_id = menuLocation;
    const menu_id = selectedMenu;
    try {
      const trainRes = await trainModel(token, location_id, menu_id);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setIsLoading(false);
      setIsTraining(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {isTraining ? (
        <div className="fixed inset-0 bg-[#0000005c] bg-opacity-90 flex items-center justify-center z-50">
          <div className="w-full h-full flex items-center justify-center ">
            <AiAnimation />
          </div>
        </div>
      ) : null}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-screen">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 mt-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How to Use the Sales Prediction System
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Step 1: Select Your Parameters
                </h3>
                <p>
                  First, select your outlet, location, and menu item from the
                  dropdown menus. These selections will determine which data
                  we'll use for training and prediction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Step 2: Upload Historical Data
                </h3>
                <p>
                  Upload your historical sales data in CSV format. The data
                  should include dates and corresponding sales values. You can
                  either drag and drop your file or click the upload button.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Step 3: Train the Model
                </h3>
                <p>
                  After uploading your data, click the "Train Data" button to
                  train the prediction model. The system will process your
                  historical data and prepare it for forecasting.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Step 4: View Predictions
                </h3>
                <p>
                  Once training is complete, the system will display a forecast
                  chart showing predicted sales values for the selected number
                  of days.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-14">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Upload Data
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
            {customers?.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="location-select"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Outlets:
                </label>
                <select
                  id="location-select"
                  value={location}
                  onChange={(e) => handleCustomerSelect(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="location-select"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Location:
                </label>
                <select
                  id="location-select"
                  value={menuLocation}
                  onChange={(e) => setMenuLocation(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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

            {menu && (
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="location-select"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Menu:
                </label>
                <select
                  id="location-select"
                  value={selectedMenu || ""}
                  onChange={(e) =>
                    setSelectedMenu(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Select Menu</option>
                  {menu?.length > 0 &&
                    menu.map((loc) => (
                      <option key={loc.id} value={loc?.id}>
                        {loc?.name} {loc?.city}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Uploading file...</p>
              </div>
            ) : uploadComplete ? (
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="mt-4 text-green-600 font-medium">
                  Upload Complete!
                </p>
                <div className="flex justify-center align-middle">
                <button
                    onClick={trainUploadedData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base mr-4"
                  >
                    Train Model
                  </button>
                  <button
                    onClick={() => setUploadComplete(false)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Upload Another File
                  </button>
                </div>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2h6a2 2 0 012 2z"
                  />
                </svg>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                  Drag and drop your CSV file here
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Supported format: CSV only
                </p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer inline-block text-sm sm:text-base"
                >
                  Upload Files
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainModel;
