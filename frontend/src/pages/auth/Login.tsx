import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await loginUser({ email, password });
            const { token, user } = res.data.data;

            localStorage.clear(); 
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast.success(`Welcome back, ${user.name || 'User'}!`);

            if (user.role === "vendor") navigate("/vendor");
            else if (user.role === "admin") navigate("/admin");
            else navigate("/home");
        } catch (error: any) {
            console.error(error.response);
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 relative overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>

            <div className="bg-slate-900 p-8 md:p-10 shadow-2xl rounded-3xl w-full max-w-md border border-slate-800 z-10">
                
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 
                        className="text-3xl text-orange-500 mb-2 tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 900 }}
                    >
                        SOMESWARI
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Foods & Pickles</p>
                </div>

                <h2 className="text-xl text-white mb-6 font-extrabold text-center uppercase tracking-widest">Login to Account</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="yourname@gmail.com" 
                            className="w-full mt-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full mt-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                </div>

                <button 
                    onClick={handleLogin} 
                    disabled={loading}
                    className={`w-full mt-8 bg-orange-600 text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-900/40 transition-all transform hover:-translate-y-1 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-500'}`}
                >
                    {loading ? "Authenticating..." : "Sign In"}
                </button>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-xs font-medium">
                        Don't have an account? 
                        <button onClick={() => navigate("/register")} className="ml-2 text-orange-500 font-black hover:underline underline-offset-4">Register Now</button>
                    </p>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800 text-center">
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">📍 Pure Homemade from Tenali</p>
                </div>
            </div>
        </div>
    );
};

export default Login;