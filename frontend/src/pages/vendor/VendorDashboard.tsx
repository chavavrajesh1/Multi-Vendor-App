import { useEffect, useState, useCallback } from "react";
import { getVendorProducts } from "../../api/product.api";
import { getVendorOrders, updateOrderStatus } from "../../api/order.api";
import { useNavigate } from "react-router-dom";
import { 
  Store, Clock, Package, ShoppingBag, CheckCircle, 
  Loader2, AlertCircle, TrendingUp, XCircle, LayoutDashboard,
  Truck, ChefHat, Copy, Share2
} from "lucide-react";
import { toast } from "react-hot-toast";

const VendorDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        getVendorProducts(),
        getVendorOrders()
      ]);

      const pData = productsRes.data?.products || productsRes.data?.data?.products || productsRes.data?.data || [];
      const oData = ordersRes.data?.orders || ordersRes.data?.data?.orders || ordersRes.data?.data || [];

      setProducts(Array.isArray(pData) ? pData : []);
      setOrders(Array.isArray(oData) ? oData : []);
    } catch (error) {
      console.error("Dashboard Loading Error:", error);
      toast.error("డేటా లోడ్ చేయడంలో సమస్య ఏర్పడింది");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.data.success) {
        toast.success(`స్టేటస్ '${newStatus}' కి మార్చబడింది`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error("స్టేటస్ అప్‌డేట్ కాలేదు");
    }
  };

  // డెలివరీ లింక్ కాపీ చేసే ఫంక్షన్
  const copyDeliveryLink = (orderId: string) => {

    // ఇక్కడ 'YOUR_PC_IP' బదులు మీ కంప్యూటర్ IP అడ్రస్ ఇవ్వండి
  // లేదా లైవ్ లో ఉన్నప్పుడు ఆటోమేటిక్ గా window.location.origin పనిచేస్తుంది
  const domain = window.location.hostname === "localhost" 
    ? "http://10.136.167.136:5173" // మీ IP ఇక్కడ ఇవ్వండి
    : window.location.origin;

    const link = `${domain}/delivery-update/${orderId}`;
    navigator.clipboard.writeText(link);
    toast.success("డెలివరీ లింక్ కాపీ అయింది! వాట్సాప్ ద్వారా పంపండి.");
  };

  const completedOrdersList = orders.filter(o => o.status?.toLowerCase() === "delivered");
  const activeOrdersList = orders.filter(o => 
    ["pending", "confirmed", "preparing", "out_for_delivery"].includes(o.status?.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 bg-slate-50 min-h-screen pt-4">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col items-center justify-center space-y-2 py-6">
        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 mb-2">
          <LayoutDashboard size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-center uppercase">
          Vendor <span className="text-orange-600">Dashboard</span>
        </h1>
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">
            Someswari Foods & Pickles
          </p>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner"><Package size={28} /></div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Catalog</p>
            <p className="text-3xl font-black text-slate-900">{products.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center shadow-inner"><Clock size={28} /></div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Orders</p>
            <p className="text-3xl font-black text-slate-900">{activeOrdersList.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center shadow-inner"><CheckCircle size={28} /></div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales</p>
            <p className="text-3xl font-black text-slate-900">{completedOrdersList.length}</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        
        {/* RECENT ORDERS LIST */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-orange-50/10">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-3">
                <ShoppingBag size={20} className="text-orange-600" /> Recent Inbound Orders
              </h3>
              <button onClick={() => navigate("/vendor/orders")} className="text-[11px] font-black text-orange-600 uppercase hover:bg-orange-50 px-4 py-2 rounded-full transition-all">Full History</button>
          </div>
          <div className="p-4 min-h-[450px]">
            {activeOrdersList.length > 0 ? (
              <div className="space-y-4">
                {activeOrdersList.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-5 bg-slate-50/30 hover:bg-white rounded-[2rem] transition-all border border-transparent hover:border-slate-100 hover:shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm font-black text-xs border border-orange-50">#ID</div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Customer: {order.user?.name || "Customer"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">₹{order.totalAmount}</p>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                          order.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* డైనమిక్ బటన్ సెక్షన్ */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                      
                      {order.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(order._id, "confirmed")}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
                          >
                            <CheckCircle size={16} /> Accept
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(order._id, "cancelled")}
                            className="flex-1 bg-white border border-red-100 text-red-500 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} /> Decline
                          </button>
                        </>
                      )}

                      {order.status === "confirmed" && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, "preparing")}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
                        >
                          <ChefHat size={16} /> Start Preparing
                        </button>
                      )}

                      {order.status === "preparing" && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, "out_for_delivery")}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                          <Truck size={16} /> Dispatch Order
                        </button>
                      )}

                      {/* డెలివరీ ఏజెంట్ కోసం లింక్ మరియు వెండర్ ఆప్షన్ */}
                      {order.status === "out_for_delivery" && (
                        <div className="w-full flex flex-col gap-2">
                           <button 
                            onClick={() => handleUpdateStatus(order._id, "delivered")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg"
                          >
                            <CheckCircle size={16} /> Mark Delivered (Self)
                          </button>
                          <button 
                            onClick={() => copyDeliveryLink(order._id)}
                            className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all"
                          >
                            <Share2 size={16} /> Copy Agent Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-40">
                <AlertCircle className="text-slate-400 mb-4" size={50} />
                <p className="text-slate-500 text-sm font-black uppercase tracking-widest">No Active Orders</p>
              </div>
            )}
          </div>
        </div>

        {/* INVENTORY OVERVIEW */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-3">
                <TrendingUp size={20} className="text-blue-500" /> Inventory Insights
              </h3>
              <button onClick={() => navigate("/vendor/products")} className="text-[11px] font-black text-blue-600 uppercase hover:bg-blue-50 px-4 py-2 rounded-full transition-all">Manage Catalog</button>
          </div>
          <div className="p-4">
            {products.length > 0 ? products.slice(0, 5).map((p) => (
              <div key={p._id} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100">
                     {p.image && <img src={p.image.replace(/\\/g, "/")} className="w-full h-full object-cover" alt={p.name} />}
                   </div>
                   <div>
                     <p className="text-base font-bold text-slate-800 tracking-tight">{p.name}</p>
                     <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Store size={12} /> Someswari Foods
                     </p>
                   </div>
                </div>
                <div className="text-right">
                   <p className={`text-base font-black ${p.stock < 5 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{p.stock} Units</p>
                </div>
              </div>
            )) : (
              <p className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest">No Products Found</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;