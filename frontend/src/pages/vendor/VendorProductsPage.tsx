import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { Edit, Trash2, Plus, Loader2, Package, Scale, Store } from "lucide-react";

// ✅ డిఫాల్ట్ ఇమేజ్ (ఒకవేళ అసలు ఇమేజ్ లేకపోతేనే ఇది కనిపిస్తుంది)
const DEFAULT_IMAGE = "/pulka.png"; 

const VendorProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products/my-products");
      setProducts(res.data.data || res.data);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error("ప్రొడక్ట్స్ లోడ్ అవ్వలేదు");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ఇమేజ్ URL ని క్లీన్ గా హ్యాండిల్ చేసే ఫంక్షన్
  const getProductImage = (imagePath: string) => {
    if (!imagePath) return DEFAULT_IMAGE;

    // ఒకవేళ అది ఇప్పటికే పూర్తి URL అయితే (http://... తో మొదలైతే)
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // బ్యాకెండ్ పాత్ లోని బ్యాక్ స్లాష్ (\) ని ఫార్వర్డ్ స్లాష్ (/) గా మార్చడం
    const cleanPath = imagePath.replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath.replace(/^\//, "")}`;
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("ఈ ప్రొడక్ట్‌ని తొలగించాలనుకుంటున్నారా?")) return;
    try {
      await API.delete(`/products/single/${id}`);
      toast.success("ప్రొడక్ట్ తొలగించబడింది");
      fetchProducts();
    } catch (error) {
      toast.error("తొలగించడం కుదరలేదు");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto mb-20 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic text-slate-900 leading-none">
            My <span className="text-orange-600">Products</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            Manage your inventory and stock
          </p>
        </div>
        <button 
          onClick={() => navigate("/vendor/add-product")}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <Package size={60} className="mx-auto text-slate-200 mb-4" />
          <p className="font-black text-slate-400 uppercase tracking-widest">No products in your list</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all group overflow-hidden flex flex-col h-full">
              
              {/* Image Container */}
              <div className="relative mb-5 overflow-hidden rounded-[2rem] h-56 shrink-0">
                <img 
                  src={getProductImage(product.image)} 
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { 
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = DEFAULT_IMAGE; 
                  }}
                />
                
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Store size={12} className="text-orange-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">
                    {product.restaurant?.name || "Someswari Pickles"}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${product.isVeg ? "text-emerald-600" : "text-red-600"}`}>
                    <span className="text-lg">●</span> {product.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-2 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2 mb-2 h-[3.5rem]">
                  <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  {product.unit && (
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg shrink-0">
                      <Scale size={12} />
                      <span className="text-[10px] font-black uppercase">{product.unit}</span>
                    </div>
                  )}
                </div>

                <p className="text-slate-400 text-xs mb-6 line-clamp-2 font-bold leading-relaxed italic min-h-[2.5rem]">
                  {product.description || "No description provided for this delicious item."}
                </p>
                
                {/* ప్రైస్ సెక్షన్ ఎప్పుడూ కిందకే ఉండటానికి mt-auto వాడాను */}
                <div className="mt-auto bg-slate-50 p-4 rounded-[1.5rem] flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Final Price</p>
                    <p className="text-2xl font-black text-slate-900">₹{product.price}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/vendor/edit-product/${product._id}`)}
                      className="p-3 bg-white text-slate-600 rounded-xl hover:text-orange-600 hover:shadow-md transition-all active:scale-90"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product._id)}
                      className="p-3 bg-white text-slate-600 rounded-xl hover:text-red-600 hover:shadow-md transition-all active:scale-90"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProductsPage;