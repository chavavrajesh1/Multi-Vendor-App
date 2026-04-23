import { useState, useEffect, useCallback } from "react";
import { getVendorOrders, updateOrderStatus } from "../../api/order.api"; // updateOrderStatus APIని ఇంపోర్ట్ చేయండి
import toast from "react-hot-toast";
import { CheckCircle, XCircle, ShoppingBag, Clock, Store, Loader2, ChevronDown } from "lucide-react";

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getVendorOrders();
      const allOrders = res.data?.orders || res.data?.data?.orders || res.data?.data || [];
      
      // అన్ని రకాల స్టేటస్ ఉన్న ఆర్డర్లను చూపిస్తున్నాం
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error("ఆర్డర్లు లోడ్ చేయడంలో విఫలమైంది");
    } finally {
      setLoading(false);
    }
  }, []);

  // స్టేటస్ అప్‌డేట్ చేసే ఫంక్షన్
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      toast.success(`ఆర్డర్ స్టేటస్ ${newStatus} కి మార్చబడింది`);
      
      // లోకల్ స్టేట్ అప్‌డేట్ (మళ్ళీ ఫెచ్ చేయకుండా నేరుగా మార్చడం)
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      toast.error("స్టేటస్ అప్‌డేట్ చేయడంలో విఫలమైంది");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
      <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto space-y-6 pt-10 px-4 pb-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              Sales <span className="text-green-500">History</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
              Someswari Foods & Pickles - Order Report
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-6 py-2 rounded-2xl text-center shadow-lg">
            <span className="text-slate-400 text-[9px] font-black uppercase block">Total Records</span>
            <span className="text-xl font-black text-white italic">{orders.length}</span>
          </div>
        </div>

        {/* ORDERS LIST */}
        {orders.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-20 text-center">
            <ShoppingBag className="text-slate-700 mx-auto mb-4" size={40} />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No orders found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-slate-700 transition-all group relative">
                
                {updatingId === order._id && (
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="animate-spin text-orange-500" />
                  </div>
                )}

                {/* Restaurant & ID Info */}
                <div className="bg-slate-800/50 px-6 py-2 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Store size={14} className="text-orange-500" />
                    <span className="text-white text-[11px] font-black uppercase tracking-wider">
                      {order.restaurant?.name || "Someswari Foods"}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[9px] font-bold italic">
                    REF: #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="p-6 flex flex-col lg:flex-row gap-6 items-center">
                  
                  {/* Status Dropdown - ఇక్కడ కొత్త చేర్పు */}
                  <div className="relative group/select">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`appearance-none w-40 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 outline-none transition-all cursor-pointer ${
                        order.status === "delivered" ? "bg-green-500/10 text-green-500" :
                        order.status === "cancelled" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      <option value="pending" className="bg-slate-900">Pending</option>
                      <option value="confirmed" className="bg-slate-900">Confirmed</option>
                      <option value="preparing" className="bg-slate-900">Preparing</option>
                      <option value="shipped" className="bg-slate-900">Shipped</option>
                      <option value="out_for_delivery" className="bg-slate-900">Out for Delivery</option>
                      <option value="delivered" className="bg-slate-900">Delivered</option>
                      <option value="cancelled" className="bg-slate-900">Cancelled</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Customer</p>
                    <p className="text-base text-white font-bold">{order.user?.name || "Guest User"}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')} | {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Items Display */}
                  <div className="flex-[2] w-full bg-black/40 rounded-2xl p-4 border border-slate-800/50">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item: any, idx: number) => (
                        <span key={idx} className="bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-700">
                          {item.product?.name} <span className="text-orange-500 ml-1">x{item.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="lg:w-40 text-center lg:text-right border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0 w-full">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Bill</p>
                    <p className="text-2xl font-black text-white italic">₹{order.totalAmount}</p>
                    <div className="mt-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                        order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {order.paymentStatus || 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrdersPage;