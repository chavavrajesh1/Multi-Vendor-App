import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Redux నుండి userInfo తీసుకోవడం (లేదా మీ పాత LocalStorage లాజిక్ వాడుకోవచ్చు)
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const adminName = userInfo?.name || "Admin";

  // Admin Stats - ఇక్కడ రియల్ డేటా ఉంటే ఇంకా బాగుంటుంది
  const stats = [
    { label: "Total Vendors", value: "12", color: "text-blue-500" },
    { label: "Pending Approvals", value: "05", color: "text-orange-500" },
    { label: "Active Orders", value: "48", color: "text-green-500" },
    { label: "Total Revenue", value: "₹45,280", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        
        {/* HEADER */}
        <div className="mb-10 border-b border-slate-800/50 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Authenticated Session: {adminName}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Control <span className="text-orange-500">Center</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            Welcome back, <span className="text-white font-bold">{adminName}</span>. System is online.
          </p>
        </div>

        {/* QUICK STATS - Grid updated to 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{stat.label}</p>
              <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ADMIN ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. VENDOR APPROVALS */}
          <div className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-orange-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Vendor Approvals</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Review new business applications. Verify documents and approve accounts to go live.
              </p>
              <button
                onClick={() => navigate("/admin/approvals")}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-900/20"
              >
                Go to Approvals <span>→</span>
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 text-9xl grayscale opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none italic font-black">V</div>
          </div>

          {/* 2. ALL ORDERS MANAGEMENT (మీరు అడిగిన కొత్త సెక్షన్) */}
          <div className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-green-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📦</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Order Log</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Track and manage all orders across all vendors. Monitor delivery status and payments.
              </p>
              <button
                onClick={() => navigate("/admin/orders")}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-900/20"
              >
                View All Orders <span>→</span>
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 text-9xl grayscale opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none italic font-black">O</div>
          </div>

          {/* 3. CATEGORY MANAGEMENT */}
          <div className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-purple-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏷️</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Marketplace Setup</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Add and manage product categories like Pickles and Sweets for your marketplace.
              </p>
              <button
                onClick={() => navigate("/admin/add-category")}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-900/20"
              >
                Manage Categories <span>→</span>
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 text-9xl grayscale opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none italic font-black">C</div>
          </div>

          {/* 4. SYSTEM PERFORMANCE (Optional) */}
          <div className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden lg:col-span-3 md:col-span-2">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Platform Health & Analytics</h2>
                    <p className="text-slate-400 text-sm">Review detailed sales reports, user growth, and vendor performance metrics.</p>
                </div>
                <button className="whitespace-nowrap flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95">
                  Open Analytics 📊
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;