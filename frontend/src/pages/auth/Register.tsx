import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api"; 
import toast from "react-hot-toast";
import { User, Mail, Lock, ArrowRight, Store, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Default గా customer రోల్ సెట్ చేస్తున్నాం
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      
      if (formData.role === "vendor") {
        toast.success("Vendor application submitted! Pending Admin approval.");
      } else {
        toast.success("Registration Successful! Please Login.");
      }
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* LEFT SIDE: Dynamic Branding based on Role */}
        <div className={`md:w-5/12 p-10 text-white flex flex-col justify-center relative transition-all duration-500 ${formData.role === 'vendor' ? 'bg-green-950' : 'bg-slate-900'}`}>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 relative">
            Join <span className={formData.role === 'vendor' ? 'text-green-500' : 'text-orange-500'}>Someswari</span> Foods
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-8 relative leading-relaxed">
            {formData.role === 'vendor' 
              ? "మీ వ్యాపారాన్ని మాతో కలిసి వృద్ధి చేసుకోండి. వెండర్‌గా ఇప్పుడే చేరండి!"
              : "టెనాలి యొక్క అసలైన రుచులను ఆస్వాదించండి. ఇప్పుడే రిజిస్టర్ చేసుకోండి!"}
          </p>
          <div className="space-y-4 relative">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              <CheckCircle size={16} className={formData.role === 'vendor' ? 'text-green-500' : 'text-orange-500'} />
              {formData.role === 'vendor' ? 'Professional Dashboard' : 'Authentic Pickles'}
            </div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              <CheckCircle size={16} className={formData.role === 'vendor' ? 'text-green-500' : 'text-orange-500'} />
              {formData.role === 'vendor' ? 'Direct Payouts' : 'Fast Delivery'}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form with Switcher */}
        <div className="md:w-7/12 p-10 md:p-14">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">Create Account</h3>
            
            {/* ROLE SWITCHER TABS */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setFormData({...formData, role: 'customer'})}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === 'customer' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => setFormData({...formData, role: 'vendor'})}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === 'vendor' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
              >
                Vendor / Seller
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              {formData.role === 'vendor' ? <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> : <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
              <input
                type="text"
                name="name"
                placeholder={formData.role === 'vendor' ? "Business / Shop Name" : "Full Name"}
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-black py-4 rounded-2xl uppercase italic tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 
                ${formData.role === 'vendor' ? 'bg-green-700 hover:bg-green-800 shadow-green-900/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'} 
                ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Processing..." : formData.role === 'vendor' ? "Apply as Vendor" : "Register Now"}
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">
              Already have an account? <Link to="/login" className="text-orange-600 hover:underline">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;