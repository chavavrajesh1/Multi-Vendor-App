import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Upload, X, Loader2 } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    unit: "",
    isVeg: "true"
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/products/single/${id}`);
        const p = res.data.data || res.data;
        
        setFormData({
          name: p.name || "",
          description: p.description || "",
          price: p.price?.toString() || "",
          stock: p.stock?.toString() || "",
          category: p.category || "",
          unit: p.unit || "",
          isVeg: p.isVeg?.toString() || "true"
        });

        if (p.image) {
          setPreview(p.image);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("ప్రొడక్ట్ డేటా లోడ్ అవ్వలేదు");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // కొత్త ఇమేజ్ సెలెక్ట్ చేసినప్పుడు అది blob URL ని క్రియేట్ చేస్తుంది
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append("image", imageFile);

    try {
      await API.put(`/products/single/${id}`, data);
      toast.success("ప్రొడక్ట్ అప్‌డేట్ అయ్యింది!");
      navigate("/vendor/products");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "అప్‌డేట్ ఫెయిల్ అయ్యింది");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ఇమేజ్ URL ని కరెక్ట్‌గా చూపించే లాజిక్
  const getImageUrl = () => {
    if (!preview) return null;
    if (preview.startsWith("blob:")) return preview; // కొత్తగా అప్‌లోడ్ చేసిన ఫోటో
    return `http://localhost:5000/${preview.replace(/\\/g, "/")}`; // సర్వర్ లో ఉన్న పాత ఫోటో
  };

  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-600" size={40} />
        <span className="ml-3 font-bold text-slate-900 uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 mt-10 mb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>
      
      <h1 className="text-2xl font-black mb-8 uppercase italic text-slate-900">
        Edit <span className="text-orange-600">Product</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Preview Section */}
        <div className="flex justify-center mb-6">
          {preview ? (
            <div className="relative">
              <img 
                src={getImageUrl() || ""} 
                alt="Preview" 
                className="w-48 h-48 object-cover rounded-[2rem] border-4 border-white shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/200?text=Image+Not+Found";
                }}
              />
              <button 
                type="button" 
                onClick={() => { setImageFile(null); setPreview(null); }} 
                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-md"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-48 h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <Upload size={24} className="mb-2 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-widest">No Image</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Product Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Product Name</label>
            <input 
              type="text" 
              value={formData.name} 
              placeholder="Ex: Roti with Chicken Fry" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-orange-200 text-slate-900 shadow-sm" 
            />
          </div>
          
          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
            <textarea 
              value={formData.description} 
              placeholder="Tell us about the ingredients or taste..." 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold min-h-[100px] outline-none border border-transparent focus:border-orange-200 text-slate-900 shadow-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Price (₹)</label>
              <input 
                type="number" 
                value={formData.price} 
                placeholder="Ex: 60" 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-orange-200 text-slate-900 shadow-sm" 
              />
            </div>
            {/* Stock */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stock Units</label>
              <input 
                type="number" 
                value={formData.stock} 
                placeholder="Ex: 20" 
                onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                required 
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-orange-200 text-slate-900 shadow-sm" 
              />
            </div>
          </div>

          {/* Unit/Weight */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Weight / Unit</label>
            <input 
              type="text" 
              value={formData.unit} 
              placeholder="Ex: 500g or 1 Plate" 
              onChange={(e) => setFormData({...formData, unit: e.target.value})} 
              required 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-orange-200 text-slate-900 shadow-sm" 
            />
          </div>

          {/* Veg/Non-Veg */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Food Type</label>
            <div className="flex gap-4">
               <button type="button" onClick={() => setFormData({...formData, isVeg: "true"})} className={`flex-1 py-4 rounded-2xl font-black transition-all ${formData.isVeg === "true" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-slate-100 text-slate-400"}`}>VEG</button>
               <button type="button" onClick={() => setFormData({...formData, isVeg: "false"})} className={`flex-1 py-4 rounded-2xl font-black transition-all ${formData.isVeg === "false" ? "bg-red-500 text-white shadow-lg shadow-red-100" : "bg-slate-100 text-slate-400"}`}>NON-VEG</button>
            </div>
          </div>

          {/* Upload Section */}
          <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <input type="file" id="edit-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="edit-upload" className="flex items-center justify-center gap-2 cursor-pointer text-orange-600 font-black uppercase text-xs tracking-widest">
              <Upload size={16} /> Update Product Photo
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? "Saving Changes..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;