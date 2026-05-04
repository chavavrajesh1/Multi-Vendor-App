import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../redux/slices/authSlice";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-slate-800">
          <h1 className="text-xl font-black tracking-tighter italic uppercase text-orange-500">
            Someswari <span className="text-white">Admin</span>
          </h1>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4">
          <Link to="/admin" className="block p-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
            📊 Dashboard
          </Link>
          <Link to="/admin/approvals" className="block p-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
            ✅ Vendor Approvals
          </Link>
          <Link to="/admin/vendors" className="block p-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
            👥 Vendor List
          </Link>
          <Link to="/admin/add-category" className="block p-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
            📁 Add Categories
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full p-3 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP HEADER */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
          <h2 className="text-slate-600 font-semibold uppercase tracking-widest text-xs">Admin Control Panel</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800">Welcome, Admin</span>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        {/* CONTENT PAGE */}
        <main className="p-8">
          <Outlet /> {/* ఇక్కడ మీ AdminDashboard, Approvals మొదలైనవి వస్తాయి */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;