import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Package, IndianRupee, Layers, Store, 
  PlusCircle, Upload, X, Tag, Scale, FileText, Leaf 
} from "lucide-react";
import API from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AddProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // కేటగిరీల జాబితా
  const appCategories = [
    "Sweets", "Hots", "Veg Pickles", "Non-Veg Pickles", 
    "Kirana Items", "Veg Biryani", "Non-Veg Biryani", "Rotis & Pulkas"
  ];
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "0",
    stock: "",
    category: "",
    restaurant: "",
    unit: "",
    isVeg: "true"
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resResp = await API.get("/vendor/my-restaurants");
        const shopList = resResp.data.data || [];
        setRestaurants(shopList);
        
        const params = new URLSearchParams(location.search);
        const rId = params.get("restaurantId");

        if (rId) {
          setFormData(prev => ({ ...prev, restaurant: rId }));
        } else if (shopList.length === 1) {
          setFormData(prev => ({ ...prev, restaurant: shopList[0]._id }));
        }
      } catch (error) {
        toast.error("డేటాను లోడ్ చేయడంలో విఫలమైంది");
      }
    };
    fetchInitialData();
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ పక్కా వాలిడేషన్
    if (!formData.restaurant) return toast.error("స్టోర్‌ను ఎంచుకోండి");
    if (!formData.name) return toast.error("ప్రోడక్ట్ పేరు తప్పనిసరి");
    if (!formData.category) return toast.error("కేటగిరీని ఎంచుకోండి");
    if (!formData.unit) return toast.error("Unit (Ex: 500g, 1kg) తప్పనిసరి");
    if (!formData.price) return toast.error("ధరను నమోదు చేయండి");
    if (!formData.description) return toast.error("ప్రోడక్ట్ వివరణ రాయండి");
    
    // ఇమేజ్ లేకపోతే ఆపండి
    if (!imageFile) return toast.error("ప్రోడక్ట్ ఫోటోను అప్‌లోడ్ చేయండి");

    setLoading(true);

    // ✅ FormData ని తయారు చేయడం
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", formData.discountPrice);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("restaurant", formData.restaurant);
    data.append("unit", formData.unit);
    data.append("isVeg", formData.isVeg);
    
    // ముల్టర్ కోసం 'image' అనే పేరుతో ఫైల్ ని పంపుతున్నాం
    data.append("image", imageFile);

    try {
      const response = await API.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("ప్రోడక్ట్ విజయవంతంగా యాడ్ చేయబడింది!");
        navigate("/vendor/products");
      }
    } catch (error: any) {
      console.error("Submit Error:", error.response?.data);
      toast.error(error.response?.data?.message || "సేవ్ చేయడంలో లోపం జరిగింది");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter">
            <PlusCircle className="text-orange-600 w-8 h-8" />
            Add <span className="text-orange-600">Product</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Someswari Pickles Inventory System</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: IMAGE UPLOAD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block text-center">Item Photo</label>
              <div className="relative">
                {preview ? (
                  <div className="relative h-64 rounded-3xl overflow-hidden border border-slate-100">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setPreview(""); }} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all">
                    <Upload className="w-8 h-8 mb-2 text-slate-300" />
                    <span className="text-xs font-bold text-slate-500 italic">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block flex items-center gap-2">
                <FileText size={14} /> Description
              </label>
              <textarea 
                name="description" 
                rows={4} 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="రుచి, తయారీ గురించి రాయండి..." 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                required
              ></textarea>
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Store</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select name="restaurant" value={formData.restaurant} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-orange-500">
                    <option value="">-- Select Store --</option>
                    {restaurants.map((res) => <option key={res._id} value={res._id}>{res.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Name</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Mango Pickle" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-orange-500">
                    <option value="">-- Choose --</option>
                    {appCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block text-orange-600">Unit (Ex: 500g, 1kg)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                  <input type="text" name="unit" value={formData.unit} onChange={handleChange} placeholder="500g" required className="w-full pl-12 pr-4 py-4 bg-orange-50/50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-orange-500 placeholder:text-orange-200" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Stock Qty</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Dietary Type</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setFormData({...formData, isVeg: "true"})} className={`flex-1 p-4 rounded-2xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all ${formData.isVeg === "true" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
                    <Leaf size={16} /> Veg
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isVeg: "false"})} className={`flex-1 p-4 rounded-2xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all ${formData.isVeg === "false" ? "bg-red-500 text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
                    <X size={16} /> Non-Veg
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => navigate("/vendor/products")} className="flex-1 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" disabled={loading} className="flex-[2] py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest bg-slate-950 text-white shadow-2xl hover:bg-orange-600 transition-all disabled:opacity-50">
                {loading ? "Saving..." : "Publish Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;