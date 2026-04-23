import { useEffect, useState } from "react";
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

const Approvals = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/vendors");
      const allVendors = res.data.vendors || [];
      const pendingVendors = allVendors.filter((vendor: Vendor) => !vendor.isApproved);
      setVendors(pendingVendors);
    } catch (error) {
      setError("Failed to fetch vendors list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (vendorId: string) => {
    try {
      setApprovingId(vendorId);
      await API.patch(`/admin/approve-vendor/${vendorId}`);
      toast.success("Vendor approved successfully!");
      setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      {/* స్పేస్ తగ్గించడానికి pt-10 వాడాను */}
      <div className="pt-10 p-6 max-w-5xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Vendor <span className="text-orange-500">Approvals</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Review and grant access to new business partners.</p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Pending: {vendors.length}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 mb-4"></div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Request Data...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="rounded-[2rem] border border-red-900/20 bg-red-950/10 p-8 text-center">
            <p className="text-red-400 font-bold mb-4">{error}</p>
            <button
              onClick={fetchVendors}
              className="rounded-xl bg-red-600 px-6 py-2 text-xs font-black uppercase text-white hover:bg-red-500 transition-all"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && vendors.length === 0 && (
          <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/50 p-20 text-center">
            <div className="text-4xl mb-4 opacity-20">✅</div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">All caught up! No pending requests.</p>
          </div>
        )}

        {/* VENDORS LIST */}
        {!loading && !error && vendors.length > 0 && (
          <div className="grid gap-4">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="group flex flex-col gap-6 rounded-[2rem] border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center md:justify-between hover:border-orange-500/30 transition-all shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                    🏢
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                      {vendor.name}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">{vendor.email}</p>
                    <div className="flex gap-3 mt-2">
                       <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                         Role: {vendor.role}
                       </span>
                       {vendor.createdAt && (
                         <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">
                           Applied: {new Date(vendor.createdAt).toLocaleDateString()}
                         </span>
                       )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApprove(vendor._id)}
                  disabled={approvingId === vendor._id}
                  className={`relative overflow-hidden rounded-2xl px-8 py-3 text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                    approvingId === vendor._id
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/20"
                  }`}
                >
                  {approvingId === vendor._id ? "Processing..." : "Grant Access"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;