import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

export const CustomerOrderConfirmation = () => {

  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {

    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrder();

  }, [orderId]);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Order not found</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">

        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Order Confirmed
        </h1>

        <p>
          Your order <b>#{order.orderNumber}</b> has been confirmed.
        </p>

        <div className="border rounded p-4 my-4">

          <p className="text-sm text-gray-500">Payment Method</p>
          <p className="font-semibold capitalize">{order.paymentMethod}</p>

          <p className="text-sm text-gray-500 mt-2">Payment Status</p>
          <p className="font-semibold text-yellow-600 capitalize">
            {order.paymentStatus}
          </p>

          <p className="text-sm text-gray-500 mt-2">Total Amount</p>
          <p className="font-bold text-lg">₹{order.totalAmount}</p>

        </div>

        <button
          onClick={() => navigate("/orders")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View My Orders
        </button>

      </div>

    </div>
  );
};