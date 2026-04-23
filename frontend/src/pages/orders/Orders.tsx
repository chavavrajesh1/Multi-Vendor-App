import { useEffect, useState } from "react";
import { getCustomerOrders } from "../../api/order.api";

interface ProductItem {
    product: {
        name: string;        
    };
    price: number;
    quantity: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    items: ProductItem[];
}

const Orders = () => {

    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await getCustomerOrders();
            setOrders(res.data.orders);
        } catch (error) {
            console.log("Failed to fetch orders");
        }
    };

    // Order Status Color 

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-200 text-yellow-800";
            case "accepted":
                return "bg-blue-200 text-blue-800";
            case "preparing":
                return "bg-orange-200 text-orange-800";
            case "delivered":
                return "bg-green-200 text-green-800";
            case "cancelled":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200";
        }
    };

    // Payment Status Color

    const getPaymentColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-200 text-green-800";
            case "pending":
                return "bg-yellow-200 text-yellow-800";
            case "failed":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200";
        }
    };

    useEffect(() => {
        fetchOrders();

        const interval = setInterval(fetchOrders, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">You have no orders yet.</p>
            ) : (

                <div className="space-y-4">
                    {orders.map((order) => (

                        <div key={order._id} className="border p-4 rounded shadow bg-white">

                            {/* Order Header */}

                            <div className="flex justify-between items-center">

                                <h2 className="font-bold">
                                    Order #{order.orderNumber}
                                </h2>

                                <span className={`px-2 py-1 rounded text-sm capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                            </div>

                            {/* Payment Info */}

                            <div className="mt-2 flex gap-4 text-sm">

                                <span className="capitalize">
                                    Payment Method: <b>{order.paymentMethod}</b>
                                </span>

                                <span className={`px-2 py-1 rounded capitalize ${getPaymentColor(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>

                            {/* Products */}

                            <div className="mt-3">

                                {order.items.map((item, index) => (

                                    <div key={index} className="flex justify-between text-sm">

                                        <p>{item.product?.name}</p>

                                        <p>₹{item.price} × {item.quantity}</p>
                                    </div>


                                ))}
                            </div>

                            {/* Total */}

                            <div className="mt-3 font-bold">
                                Total: ₹{order.totalAmount}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;