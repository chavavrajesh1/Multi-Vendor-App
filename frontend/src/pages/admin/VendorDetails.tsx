import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import toast from "react-hot-toast";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        // Vendor details mariyu vari products ni fetch cheyali
        const res = await API.get(`/admin/vendor-details/${id}`);
        setVendor(res.data.vendor);
        setProducts(res.data.products || []);
      } catch (error) {
        toast.error("Failed to fetch vendor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchVendorDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
        >
          ← Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: VENDOR PROFILE CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-3xl mb-6">
                🏢
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-2">
                {vendor?.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${vendor?.isApproved ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                {vendor?.isApproved ? 'Verified Partner' : 'Pending Approval'}
              </span>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-300">{vendor?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Joined On</p>
                  <p className="text-sm font-bold text-slate-300">{new Date(vendor?.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-bold text-slate-300 capitalize">{vendor?.role}</p>
                </div>
              </div>

              {!vendor?.isApproved && (
                <button className="w-full mt-10 bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                  Approve Vendor
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: VENDOR INVENTORY & STATS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* INVENTORY HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Store <span className="text-orange-500">Inventory</span>
              </h2>
              <span className="text-slate-500 text-xs font-bold uppercase">{products.length} Products</span>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.length === 0 ? (
                <div className="col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                  No products uploaded by this vendor yet.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex gap-4 hover:border-slate-700 transition-all">
                    <div className="w-16 h-16 bg-black rounded-2xl overflow-hidden border border-slate-800">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">{product.name}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-1">₹{product.price}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mt-2 inline-block ${product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;