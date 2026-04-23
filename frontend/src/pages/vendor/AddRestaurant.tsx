import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import toast from "react-hot-toast";

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Backend API call to save restaurant
      await API.post("/vendor/add-restaurant", formData);
      toast.success("Restaurant added successfully!");
      navigate("/vendor/dashboard"); // Add chesina tharvatha dashboard ki vellali
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Register Your <span className="text-orange-500">Business</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Add your restaurant details to start selling.</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Restaurant Name */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Restaurant Name</label>
              <input
                type="text"
                required
                className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all"
                placeholder="e.g., Someswari Pickles"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cuisine Type</label>
              <input
                type="text"
                required
                className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all"
                placeholder="e.g., Pickles, South Indian, Spices"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Business Address</label>
              <textarea
                required
                rows={4}
                className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all resize-none"
                placeholder="Enter full address of the restaurant..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-900/20"
              }`}
            >
              {loading ? "Registering..." : "Add Restaurant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;