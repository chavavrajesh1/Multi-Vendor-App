import axios from "axios";

const API_URL = "http://localhost:5000/api/vendor"; 

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 1. Dashboard Stats
export const getVendorStats = async () => {
  return await axios.get(`${API_URL}/dashboard-stats`, getAuthHeaders());
};

// 2. Vendor Orders
export const getVendorOrders = async () => {
  return await axios.get(`${API_URL}/orders`, getAuthHeaders());
};

// 3. Vendor Products
export const getVendorProducts = async () => {
  return await axios.get(`${API_URL}/products`, getAuthHeaders());
};

/**
 * 4. వెండర్ యొక్క అన్ని షాపులు/రెస్టారెంట్ల లిస్ట్ పొందడానికి
 * ఈ ఫంక్షనే మనం డాష్‌బోర్డ్ లో 'myShops' కోసం వాడుతున్నాం
 */
export const getMyRestaurants = async () => {
  return await axios.get(`${API_URL}/my-restaurants`, getAuthHeaders());
};

// 5. Add or Update Shop Profile
export const updateShopProfile = async (shopData: any) => {
  return await axios.post(`${API_URL}/add-restaurant`, shopData, getAuthHeaders());
};