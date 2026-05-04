import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation కోసం
import { 
  Package, ShoppingCart, CurrencyInr, 
  Plus, TrendUp, Storefront, MapPin, X, CaretRight, ListBullets 
} from "@phosphor-icons/react";
import { getVendorStats, getVendorProducts, getVendorOrders, getMyRestaurants, updateShopProfile } from "../../api/vendor.api";
import toast from "react-hot-toast";

const VendorDashboard = () => {
  const navigate = useNavigate(); // Navigation hook
  const [data, setData] = useState({
    stats: { totalSales: 0, totalOrders: 0, activeProducts: 0, revenue: 0 },
    recentProducts: [],
    recentOrders: [],
    myShops: []
  });
  const [loading, setLoading] = useState(true);
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopInfo, setShopInfo] = useState({ name: "", type: "Restaurant", address: "", phone: "" });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, shopsRes] = await Promise.all([
        getVendorStats(),
        getVendorProducts(),
        getVendorOrders(),
        getMyRestaurants()
      ]);

      setData({
        stats: statsRes.data.data,
        recentProducts: productsRes.data.data.slice(0, 5),
        recentOrders: Array.isArray(ordersRes.data.data) ? ordersRes.data.data : [],
        myShops: Array.isArray(shopsRes.data.data) ? shopsRes.data.data : []
      });
    } catch (error: any) {
      toast.error("డేటా లోడ్ అవ్వలేదు.");
    } finally {
      setLoading(false);
    }
  };

  // షాప్ క్లిక్ చేసినప్పుడు యాడ్ ప్రొడక్ట్ పేజీకి వెళ్లడానికి
  const handleShopClick = (shopId: string) => {
    // ఇక్కడ మీ రూట్ ఏదైతే అది ఇవ్వండి, ఉదాహరణకు: /vendor/add-product/SHOP_ID
    navigate(`/vendor/add-product?restaurantId=${shopId}`);
  };

  const handleShopSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateShopProfile(shopInfo);
      toast.success("బిజినెస్ ప్రొఫైల్ అప్‌డేట్ అయ్యింది!");
      setShowShopModal(false);
      fetchDashboard();
    } catch (err) {
      toast.error("సేవ్ చేయడంలో లోపం ఉంది.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER - Add Product button తీసివేశాను */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
              Vendor <span className="text-orange-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manage your business from here</p>
          </div>
          <div>
            <button onClick={() => setShowShopModal(true)} className="bg-white border border-slate-200 text-slate-900 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Plus size={16} weight="bold" /> Add New Shop
            </button>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Revenue" value={`₹${data.stats.totalRevenue || 0}`} icon={<CurrencyInr />} color="bg-orange-500" />
          <StatCard title="Orders" value={data.stats.totalOrders || 0} icon={<ShoppingCart />} color="bg-blue-600" />
          <StatCard title="Active Items" value={data.stats.activeProducts || 0} icon={<Package />} color="bg-emerald-600" />
          <StatCard title="Performance" value="+15%" icon={<TrendUp />} color="bg-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT ORDERS */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase tracking-tight italic mb-8 flex items-center gap-2">
                <ListBullets className="text-orange-500" size={20} weight="bold" /> Recent Orders
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-700">
                    {data.recentOrders.length > 0 ? data.recentOrders.map((order: any) => (
                      <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-5 font-mono text-xs text-slate-400">#{order._id.slice(-6)}</td>
                        <td className="py-5">{order.user?.name || "Customer"}</td>
                        <td className="py-5 font-black text-slate-900">₹{order.totalAmount}</td>
                        <td className="py-5">
                          <span className="bg-orange-50 text-orange-600 text-[9px] px-3 py-1.5 rounded-lg uppercase font-black">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* MY SHOPS - ఇక్కడ క్లిక్ చేస్తే యాడ్ ప్రొడక్ట్ కి వెళ్తుంది */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="mb-8">
              <h3 className="font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-2">
                <Storefront className="text-orange-500" size={20} weight="bold" /> My Shops
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Click arrow to add products</p>
            </div>
            
            <div className="space-y-5">
              {data.myShops.length > 0 ? data.myShops.map((shop: any) => (
                <div 
                  key={shop._id} 
                  onClick={() => handleShopClick(shop._id)} // Click event
                  className="group p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-xs mb-1">{shop.name}</h4>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
                        <MapPin size={12} weight="fill" className="text-orange-400" /> {shop.address}
                      </div>
                    </div>
                    {/* Arrow Mark */}
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm border border-slate-100">
                      <CaretRight size={18} weight="bold" />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[1.5rem]">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Shops Found</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SHOP REGISTRATION MODAL */}
      {showShopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowShopModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} weight="bold" /></button>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Register <span className="text-orange-500">Business</span></h2>
            <form onSubmit={handleShopSubmit} className="space-y-4">
              <input required type="text" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold" placeholder="Business Name" onChange={(e) => setShopInfo({...shopInfo, name: e.target.value})} />
              <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold appearance-none" onChange={(e) => setShopInfo({...shopInfo, type: e.target.value})}>
                <option value="Restaurant">Restaurant</option>
                <option value="Shop">Homemade / Shop</option>
              </select>
              <textarea rows={3} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold resize-none" placeholder="Full Address" onChange={(e) => setShopInfo({...shopInfo, address: e.target.value})} />
              <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-orange-200 mt-4">Save Profile</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-all group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none mt-2">{value}</p>
    </div>
  </div>
);

export default VendorDashboard;