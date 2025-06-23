import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { bulkUploadDatapoints, forecast, trainModel } from "../services";
import { useMenu } from "../context/useMenu";
import { useCustomer } from "../context/useCustomers";
import { useLocation } from "../context/useLocation";
import { Line } from "react-chartjs-2";
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
import { useNavigate } from "react-router-dom";
import DashboardMetrics from "../components/DashboardMetrics";
import { Button } from "../components/ui/Button";
import { SelectField } from "../components/ui/TextField";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const { customers } = useCustomer();
  const { location, fetchData, selectedLocationList } = useLocation();

  const { menu, menuLocation, setMenuLocation, fetchMenuData } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState();
  const [forecastData, setForecastData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dateRange, setDateRange] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [noDataAvailable, setNoDataAvaialable] = useState(false);
  const navigate = useNavigate();

  const getForcastData = async () => {
    if (!selectedMenu) {
      alert("Please select menu");
      return;
    }
    setIsTraining(true);
    setIsLoading(true);

    const location_id = menuLocation;
    const menu_id = selectedMenu;
    try {
      const days = dateRange;
      const res = await forecast(token, location_id, menu_id, days);
      console.log(res, "resres");
      if (res.success) {
        setForecastData(res.data);
      } else {
        setForecastData([]);
        setNoDataAvaialable(true);
        alert("Failed to fetch forecast data");
      }
    } catch (error) {
      alert("No data Available.");
    } finally {
      setIsLoading(false);
      setIsTraining(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Add confirmation popup after successful upload
      if (
        window.confirm(
          "File uploaded successfully! Would you like to train the model now?"
        )
      ) {
        getForcastData();
      }
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
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    handleBulkUpload(file);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />
        <div className="relative p-8">
          <DashboardMetrics />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />
        <div className="relative p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Sales Prediction
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customers?.length > 0 && (
              <SelectField
                label="Outlets"
                id="outlet-select"
                value={location}
                onChange={(e) =>
                  handleCustomerSelect(Number(e.target.value))
                }
              >
                {customers?.length > 0 &&
                  customers.map((loc) => (
                    <option key={loc.id} value={loc?.id}>
                      {loc?.name} {loc?.city}
                    </option>
                  ))}
              </SelectField>
            )}

            {selectedLocationList && (
              <SelectField
                label="Location"
                id="location-select"
                value={menuLocation}
                onChange={(e) => setMenuLocation(Number(e.target.value))}
              >
                {selectedLocationList?.length > 0 &&
                  selectedLocationList.map((loc) => (
                    <option key={loc.id} value={loc?.id}>
                      {loc?.name} {loc?.city}
                    </option>
                  ))}
              </SelectField>
            )}
            
            {menu && (
              <SelectField
                label="Menu"
                id="menu-select"
                value={selectedMenu || ""}
                onChange={(e) =>
                  setSelectedMenu(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Select Menu</option>
                {menu?.length > 0 &&
                  menu.map((loc) => (
                    <option key={loc.id} value={loc?.id}>
                      {loc?.name} {loc?.city}
                    </option>
                  ))}
              </SelectField>
            )}
            <SelectField
              label="Days from today"
              id="days-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {[...Array(30)].map((_, index) => (
                <option key={index + 1} value={`${index + 1}`}>
                  {index + 1} {index === 0 ? "Day" : "Days"}
                </option>
              ))}
            </SelectField>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={getForcastData}
              variant="solid"
              color="blue"
            >
              Generate Forecast
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />
        <div className="relative p-8">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-gray-100/50 rounded-xl backdrop-blur-sm">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading forecast data...</p>
              </div>
            ) : chartData ? (
              <div className="w-full h-full p-4">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-center">
                  {noDataAvailable
                    ? "No data available to forecast."
                    : "Select Outlet, Location and Menu to generate forecast data."}
                </p>
                {noDataAvailable && (
                  <Button
                    onClick={() => navigate("/trainModel")}
                    variant="solid"
                    color="blue"
                  >
                    Upload Training Data
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
