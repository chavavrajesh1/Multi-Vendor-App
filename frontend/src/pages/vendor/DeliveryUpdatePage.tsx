import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderByIdController, updateOrderStatus } from "../../api/order.api";
import { CheckCircle, Truck, IndianRupee, MapPin, Phone, Loader2, ShoppingBag, User, Hash } from "lucide-react";
import { toast } from "react-hot-toast";

const DeliveryUpdatePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByIdController(orderId!);
        // Backend API నుండి డేటాని సెట్ చేస్తున్నాం
        setOrder(res.data.order || res.data); 
      } catch (error) {
        toast.error("ఆర్డర్ వివరాలు లభించలేదు");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleDeliverySuccess = async () => {
    try {
      await updateOrderStatus(orderId!, "delivered");
      toast.success("ఆర్డర్ విజయవంతంగా డెలివరీ చేయబడింది!");
      // డెలివరీ తర్వాత స్టేటస్ అప్‌డేట్ చూపిస్తున్నాం
      setOrder((prev: any) => ({ ...prev, status: "delivered" }));
    } catch (error) {
      toast.error("అప్‌డేట్ చేయడంలో సమస్య ఏర్పడింది");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-orange-600" size={40} />
    </div>
  );

  if (!order) return <div className="p-10 text-center font-bold">ఆర్డర్ లభించలేదు.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm border-b border-slate-100 sticky top-0 z-10 text-center">
        <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
          <Truck size={22} strokeWidth={3} />
          <h2 className="text-lg font-black uppercase tracking-tight">Delivery Details</h2>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Someswari Pickles</p>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        
        {/* 1. Order ID & Customer Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
             <div className="flex items-center gap-2 text-slate-500">
               <Hash size={16} />
               <span className="text-xs font-bold uppercase">ID: {order._id.slice(-8).toUpperCase()}</span>
             </div>
             <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
               {order.status}
             </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <User size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Customer Name</p>
              <h3 className="font-black text-xl text-slate-900 leading-none">{order.user?.name}</h3>
              <p className="text-xs text-slate-500 font-bold mt-1">User ID: {order.user?._id?.slice(-6)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
              <MapPin size={20} className="text-red-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Delivery Address</p>
                <p className="text-sm text-slate-800 font-bold leading-relaxed">{order.deliveryAddress}</p>
              </div>
            </div>

            <a href={`tel:${order.user?.phone}`} className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase shadow-lg shadow-blue-100 active:scale-95 transition-all">
              <Phone size={18} fill="white" /> Call Customer
            </a>
          </div>
        </div>

        {/* 2. Items List Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={18} className="text-orange-600" />
            <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">Items Included</h4>
          </div>
          
          <div className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <p className="text-sm font-bold text-slate-800">{item.productId?.name || "Someswari Product"}</p>
                </div>
                <p className="text-sm font-black text-slate-900">₹{item.productId?.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
            <div className="flex justify-between items-center">
               <span className="font-bold text-slate-500 text-sm">Grand Total</span>
               <div className="flex items-center gap-1 text-green-600">
                  <IndianRupee size={20} strokeWidth={3} />
                  <span className="text-2xl font-black">{order.totalAmount}</span>
               </div>
            </div>
            <p className="text-[10px] text-right font-black text-orange-500 uppercase mt-1">
              Payment Mode: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}
            </p>
          </div>
        </div>

      </div>

      {/* Sticky Action Button */}
      <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
        {order.status === "delivered" ? (
          <div className="w-full bg-green-500 text-white py-5 rounded-[2rem] font-black uppercase text-center flex items-center justify-center gap-2 shadow-xl shadow-green-100">
            <CheckCircle size={24} /> Delivered
          </div>
        ) : (
          <button 
            onClick={handleDeliverySuccess}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-orange-200 transition-all active:scale-95"
          >
            <CheckCircle size={24} />
            Confirm Delivery & Cash
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveryUpdatePage;