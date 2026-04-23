import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, IndianRupee, Layers, Store, Image as ImageIcon, PlusCircle, Upload, X } from "lucide-react";
import API from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // ఫైల్ మరియు ప్రివ్యూ కోసం కొత్త స్టేట్స్
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
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resResp, catResp] = await Promise.all([
          API.get("/vendor/my-restaurants"),
          API.get("/categories"),
        ]);
        setRestaurants(resResp.data.data || []);
        setCategories(catResp.data.categories || []);
        
        if (resResp.data.data?.length === 1) {
          setFormData(prev => ({ ...prev, restaurant: resResp.data.data[0]._id }));
        }
      } catch (error) {
        toast.error("డేటాను లోడ్ చేయడంలో విఫలమైంది");
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ఫైల్ సెలెక్ట్ చేసినప్పుడు హ్యాండిల్ చేసే ఫంక్షన్
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // బ్రౌజర్ లో ఫోటో చూపించడానికి
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ముఖ్యమైన మార్పు: JSON కి బదులు FormData వాడుతున్నాము
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", formData.discountPrice);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("restaurant", formData.restaurant);
    
    if (imageFile) {
      data.append("image", imageFile); // 'image' అనే కీ తో ఫైల్ వెళ్తుంది
    }

    try {
      const response = await API.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data", // ఫైల్ పంపేటప్పుడు ఇది ఉండాలి
        },
      });

      if (response.data.success) {
        toast.success("ప్రోడక్ట్ విజయవంతంగా యాడ్ చేయబడింది!");
        navigate("/vendor/products");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "ప్రోడక్ట్ యాడ్ చేయడంలో లోపం జరిగింది");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <PlusCircle className="text-orange-600 w-8 h-8" />
            Add New <span className="text-orange-600">Product</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Someswari Pickles మెనూలోకి కొత్త ఐటమ్‌ను చేర్చండి.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            
            {/* IMAGE UPLOAD SECTION */}
            <div className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Product Image</label>
              <div className="flex flex-col items-center justify-center">
                {preview ? (
                  <div className="relative w-full h-64 rounded-[2rem] overflow-hidden border-2 border-slate-100">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setImageFile(null); setPreview(""); }}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500 font-bold">Click to upload <span className="text-orange-600">Photo</span></p>
                      <p className="text-xs text-slate-400 font-black">PNG, JPG or WEBP</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RESTAURANT SELECTION */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Select Restaurant</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select name="restaurant" value={formData.restaurant} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 appearance-none">
                    <option value="">-- Choose Restaurant --</option>
                    {restaurants.map((res) => (
                      <option key={res._id} value={res._id}>{res.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRODUCT NAME */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Name</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" name="name" placeholder="Ex: Avakaya Pickle 500g" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold" />
                </div>
              </div>

              {/* PRICE & STOCK */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="number" name="price" placeholder="0.00" value={formData.price} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Initial Stock</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="number" name="stock" placeholder="Quantity" value={formData.stock} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold" />
                </div>
              </div>

              {/* CATEGORY */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-slate-700">
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
                <textarea name="description" rows={3} placeholder="Tell customers more..." value={formData.description} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"></textarea>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate("/vendor/products")} className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className={`flex-1 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;