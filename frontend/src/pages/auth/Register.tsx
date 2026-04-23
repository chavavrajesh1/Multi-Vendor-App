import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api"; // మీ API ఫైల్ పాత్ చెక్ చేసుకోండి
import toast from "react-hot-toast";
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success("Registration Successful! Please Login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* LEFT SIDE: Branding & Info */}
        <div className="md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-orange-600/10 blur-3xl -ml-20 -mt-20"></div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 relative">
            Join <span className="text-orange-500">Someswari</span> Foods
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-8 relative leading-relaxed">
            టెనాలి యొక్క అసలైన రుచులను ఆస్వాదించండి. ఇప్పుడే రిజిస్టర్ చేసుకోండి!
          </p>
          <div className="space-y-4 relative">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              <div className="w-6 h-6 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500">✓</div>
              Authentic Pickles
            </div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              <div className="w-6 h-6 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500">✓</div>
              Fast Delivery
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Register Form */}
        <div className="md:w-7/12 p-10 md:p-14">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">Create Account</h3>
            
            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            {/* Password Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl uppercase italic tracking-widest transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 active:scale-95 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Creating Account..." : "Register Now"}
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 hover:underline">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;