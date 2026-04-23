import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. useNavigate ఇంపోర్ట్ చేయండి
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import toast from "react-hot-toast";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt?: string;
}

const AdminVendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. navigate ఫంక్షన్‌ని డిక్లేర్ చేయండి

  const fetchAllVendors = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/vendors");
      setVendors(res.data.vendors || []);
    } catch (error) {
      toast.error("Failed to load vendor directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVendors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Vendor <span className="text-orange-500">Directory</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Monitor and manage all registered business partners.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Partners</p>
              <p className="text-xl font-black text-white">{vendors.length}</p>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto mb-4"></div>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Database...</p>
                    </td>
                  </tr>
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No vendors registered yet.</p>
                    </td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg grayscale group-hover:grayscale-0 transition-all">
                            🏢
                          </div>
                          <span className="font-bold text-white text-sm">{vendor.name}</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-slate-400">{vendor.email}</td>
                      <td className="p-6">
                        {vendor.isApproved ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-sm text-slate-500">
                        {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-6 text-right">
                        {/* 3. ఇక్కడ navigate ఫంక్షన్ ని కాల్ చేస్తున్నాము */}
                        <button 
                          onClick={() => navigate(`/admin/vendor/${vendor._id}`)} 
                          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVendorList;