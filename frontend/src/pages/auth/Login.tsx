import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import toast from "react-hot-toast";
// Redux Hooks & Actions
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Redux dispatch initialize

    const handleLogin = async () => {
        // Validation
        if (!email || !password) return toast.error("Enter credentials");
        
        setLoading(true);
        try {
            // API Call
            const res = await loginUser({ email, password });
            
            // మీ API నుండి వచ్చే డేటా స్ట్రక్చర్: res.data.data = { token, user }
            const { token, user } = res.data.data;

            // ✅ 1. Redux Store ని అప్‌డేట్ చేయడం (ఇది Navbar ని మారుస్తుంది)
            dispatch(setCredentials({ user, token }));

            // ✅ 2. Local Storage లో కూడా సేవ్ చేయడం (Refresh చేసినా డేటా ఉండటానికి)
            // గమనిక: మీ authSlice లో ఇప్పటికే ఈ లాజిక్ ఉంటే ఇక్కడ అవసరం లేదు, 
            // కానీ బ్యాకప్ కోసం ఉంచవచ్చు.
            localStorage.setItem("token", token);
            localStorage.setItem("userInfo", JSON.stringify(user));

            toast.success(`Welcome to Kitchen Kart!`);
            
            // రోల్ ని బట్టి రీడైరెక్ట్ చేయడం
            if (user.role === "vendor") {
                navigate("/vendor/dashboard");
            } else if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "Login failed! Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#030712] px-6 relative overflow-hidden font-sans">
            
            {/* ANIMATED BACKGROUND ORBS */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-900/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

            {/* MAIN LOGIN CARD */}
            <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
                
                {/* BRANDING */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-[2rem] shadow-lg shadow-orange-600/20 mb-6 rotate-3">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex flex-col leading-none">
                        Kitchen <span className="text-orange-500 -mt-1">Kart</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="h-[1px] w-8 bg-slate-800"></span>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Handmade Excellence</p>
                        <span className="h-[1px] w-8 bg-slate-800"></span>
                    </div>
                </div>

                {/* INPUT FIELDS */}
                <div className="space-y-6">
                    <div className="relative group">
                        <label className="absolute -top-2.5 left-5 bg-[#0f172a] px-2 text-[10px] font-black text-orange-500 uppercase tracking-widest z-20">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-transparent border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm" 
                            placeholder="yourname@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="relative group">
                        <label className="absolute -top-2.5 left-5 bg-[#0f172a] px-2 text-[10px] font-black text-orange-500 uppercase tracking-widest z-20">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-transparent border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                </div>

                {/* SIGN IN BUTTON */}
                <button 
                    onClick={handleLogin} 
                    disabled={loading}
                    className="w-full mt-12 relative group overflow-hidden bg-white text-black p-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        {loading ? "Verifying..." : "Let's Go"}
                    </span>
                </button>

                {/* FOOTER */}
                <div className="mt-10 text-center">
                    <button 
                        onClick={() => navigate("/register")} 
                        className="text-slate-500 text-[11px] font-bold uppercase tracking-wider hover:text-white transition-colors"
                    >
                        New here? <span className="text-orange-500 underline underline-offset-4 ml-1">Create Account</span>
                    </button>
                </div>

                <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
                    <span className="h-[1px] w-10 bg-white"></span>
                    <p className="text-[8px] text-white font-black uppercase tracking-[0.3em]">Tenali • Guntur</p>
                    <span className="h-[1px] w-10 bg-white"></span>
                </div>
            </div>
        </div>
    );
};

export default Login;