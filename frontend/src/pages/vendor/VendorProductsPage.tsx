import { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorProducts, deleteProduct } from "../../api/product.api"; // deleteProduct API కూడా ఉండాలి
import { Store, RefreshCw, Package, MoreVertical, IndianRupee, Edit, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
  restaurant?: {
    _id: string;
    name: string;
  };
  category?: {
    name: string;
  };
}

const VendorProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // 1. డేటాను తీసుకురావడం
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getVendorProducts();
      const data = res.data?.data || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Products లోడ్ చేయడం సాధ్యం కాలేదు.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchProducts();
      isInitialMount.current = false;
    }
  }, [fetchProducts]);

  // 2. ప్రోడక్ట్ తొలగించే ఫంక్షన్
  const handleDelete = async (id: string) => {
    if (window.confirm("ఈ ఐటమ్‌ను ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?")) {
      try {
        await deleteProduct(id);
        toast.success("ప్రోడక్ట్ తొలగించబడింది");
        setProducts(products.filter(p => p._id !== id)); // లిస్ట్ నుండి వెంటనే తీసేయడం
      } catch (error) {
        toast.error("తొలగించడంలో లోపం జరిగింది");
      }
    }
    setActiveMenu(null);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Product <span className="text-orange-600">Inventory</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Someswari Pickles Management</p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => navigate("/vendor/add-product")} className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">
               Add New
             </button>
             <button onClick={fetchProducts} className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 bg-white">
                <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Restaurant / Branch</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                        <img 
                          src={p.image?.replace(/\\/g, "/")} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={p.name}
                          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/100?text=Pickle")}
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.category?.name || "General"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-slate-700 text-sm">{p.restaurant?.name || "Main Branch"}</span>
                    </div>
                  </td>

                  <td className="p-6 font-black text-slate-900">
                    <div className="flex items-center">
                      <IndianRupee className="w-3 h-3 text-slate-400" />
                      <span>{p.price}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {p.stock > 0 ? `${p.stock} Units` : 'Sold Out'}
                      </span>
                    </div>
                  </td>

                  <td className="p-6 text-center relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === p._id ? null : p._id)}
                      className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100 text-slate-400 hover:text-orange-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* ACTIONS DROPDOWN */}
                    {activeMenu === p._id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)}></div>
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-36 bg-white border border-slate-100 rounded-2xl shadow-2xl z-30 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                          <button 
                            onClick={() => {
                              navigate(`/vendor/edit-product/${p._id}`);
                              setActiveMenu(null);
                            }}
                            className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-3"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          
                          <div className="h-[1px] bg-slate-50 mx-2"></div>
                          
                          <button 
                            onClick={() => handleDelete(p._id)}
                            className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Products Found</p>
            <button onClick={() => navigate("/vendor/add-product")} className="mt-4 text-orange-600 font-bold text-sm hover:underline">
              Add your first product now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProductsPage;