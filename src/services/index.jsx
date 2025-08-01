import moment from "moment/moment";

// Get the API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchCustomers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const createCustomer = async (token, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      const requestError = new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
      console.error("API Error:", requestError);
      throw requestError;
    }

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const fetchCustomerById = async (token, customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const updateCustomer = async (token, customerId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const deleteCustomer = async (token, customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// Location Endpoints
const createLocation = async (token, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const fetchLocationsForCustomer = async (token, customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/?customer_id=${customerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const fetchLocation = async (token, locationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const deleteLocation = async (token, locationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const createMenuItem = async (token, locationId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/?location_id=${locationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const fetchMenuItems = async (token, locationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/?location_id=${locationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// Datapoint Endpoints
const addDatapoints = async (token, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/datapoints/bulk_add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const bulkUploadDatapoints = async (token, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/datapoints/csv_upload/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        content: data.content,
        customer_id: data.customer_id,
        location_id: data.location_id,
        menu_id: data.menu_id,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData??");
    return responseData;
  } catch (err) {
    throw err;
  }
};

const trainModel = async (token, locationId, menuId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mlmodels/train_model/?location_id=${locationId}&menu_id=${menuId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return {
      data: data,
      sucess: true,
    };
  } catch (err) {
    return {
      sucess: false,
    };
  }
};

const forecast = async (token, locationId, menuId, days) => {
  try {
    const today = moment().format("YYYY-MM-DD");
    let url = `${API_BASE_URL}/mlmodels/forecast/?location_id=${locationId}&menu_id=${menuId}&today=${today}&num_days=${days}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    return { data: data, success: true };
  } catch (err) {
    return { success: false };
  }
};

const authSuccess = async (token, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth?code=${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.text();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// Root Endpoint
const fetchRoot = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export {
  fetchCustomers,
  createCustomer,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
  createLocation,
  fetchLocationsForCustomer,
  fetchLocation,
  deleteLocation,
  createMenuItem,
  fetchMenuItems,
  addDatapoints,
  bulkUploadDatapoints,
  trainModel,
  forecast,
  authSuccess,
  fetchRoot,
};
