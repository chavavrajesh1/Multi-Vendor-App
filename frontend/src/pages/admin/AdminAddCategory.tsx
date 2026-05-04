import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const AdminAddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // ఇమేజ్ ప్రివ్యూ కోసం
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ఇమేజ్ సెలెక్ట్ చేసినప్పుడు ప్రివ్యూ చూపించడానికి
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      // గమనిక: మీ బ్యాకెండ్ రూట్ /api/categories అయితే ఇక్కడ కూడా అదే ఉండాలి
      await axios.post("http://localhost:5000/api/categories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category created successfully!");
      setName("");
      setImage(null);
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-10">
        
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-500 text-xs font-black uppercase tracking-widest mb-6 hover:text-white transition-all"
        >
          ← Back to Control Center
        </button>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Add <span className="text-purple-500">Category</span>
          </h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">Create a new product grouping for the marketplace.</p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* NAME INPUT */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">Category Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:outline-none focus:border-purple-500/50 text-white placeholder:text-slate-700 transition-all font-medium"
                placeholder="e.g. Traditional Pickles"
                required
              />
            </div>

            {/* IMAGE INPUT & PREVIEW */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">Display Image</label>
              <div className="relative w-full bg-slate-950 border border-dashed border-slate-800 p-10 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden">
                <input 
                  type="file" 
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  accept="image/*"
                />
                
                {preview ? (
                  <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mb-2" />
                ) : (
                  <span className="text-4xl mb-4">🖼️</span>
                )}

                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest z-10">
                  {image ? image.name : "Click to upload image"}
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-purple-900/20"
            >
              {loading ? "Processing..." : "Deploy Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCategory;