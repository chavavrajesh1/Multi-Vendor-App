import API from "./axios";

/* =====================================================
   PLACE ORDER (Customer)
===================================================== */
export const placeOrder = (data: {
  restaurantId: string;
  deliveryAddress: string;
  paymentMethod: "cod" | "card" | "upi" | "razorpay"; // razorpay యాడ్ చేశాను
  items: {
    productId: string;
    quantity: number;
  }[];
}) => {
  return API.post("/orders", data);
};

/* =====================================================
   GET CUSTOMER ORDERS
===================================================== */
export const getCustomerOrders = () => {
  return API.get("/orders/customer");
};

/* =====================================================
   GET VENDOR ORDERS
===================================================== */
export const getVendorOrders = () => {
  return API.get("/vendor/orders"); 
};

/* =====================================================
   GET ORDER BY ID
===================================================== */
export const getOrderByIdController = (id: string) => {
  return API.get(`/orders/${id}`);
};

/* =====================================================
   UPDATE ORDER STATUS (Vendor)
   వెండర్ ఆర్డర్ స్టేటస్ మార్చినప్పుడు ఇది పనిచేస్తుంది
===================================================== */
export const updateOrderStatus = (
  id: string,
  status: string,
  extraData?: { paymentCollected?: boolean }
) => {
  // మీ బ్యాకెండ్ రూట్ ప్రకారం ఇక్కడ కన్ఫర్మ్ చేసుకోండి
  // ఒకవేళ పాత రూట్ వాడుతుంటే మొదటి లైన్, కొత్తది అయితే రెండో లైన్ వాడండి
  return API.patch(`/orders/${id}/status`, { status, ...extraData });
  // return API.patch(`/vendor/orders/${id}/status`, { status, ...extraData });
};

/* =====================================================
   GET VENDOR DASHBOARD STATS
===================================================== */
export const getVendorDashboardStats = () => {
  return API.get("/vendor/dashboard-stats");
};