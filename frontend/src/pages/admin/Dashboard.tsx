import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  // Admin Stats (Ivi meeru API nundi fetch cheyochu, ippatiki static ga pettaanu)
  const stats = [
    { label: "Total Vendors", value: "12", color: "text-blue-500" },
    { label: "Pending Approvals", value: "05", color: "text-orange-500" },
    { label: "Active Orders", value: "48", color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Control <span className="text-orange-500">Center</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage your marketplace and vendor network.</p>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-4xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ADMIN ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* VENDOR APPROVALS CARD */}
          <div className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-orange-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl text-orange-500">🤝</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Vendor Approvals</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Review new business applications. Verify documents and approve accounts to go live on the platform.
              </p>
              <button
                onClick={() => navigate("/admin/approvals")}
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-900/20"
              >
                Go to Approvals <span>→</span>
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-4 -bottom-4 text-9xl grayscale opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                📜
            </div>
          </div>

          {/* SYSTEM MANAGEMENT CARD */}
          <div className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl text-blue-500">⚙️</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">System Panel</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Monitor platform health, manage site categories, and view overall sales performance across all vendors.
              </p>
              <button
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Open Panel <span>🔒</span>
              </button>
            </div>
             {/* Background Decoration */}
             <div className="absolute -right-4 -bottom-4 text-9xl grayscale opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                📊
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;