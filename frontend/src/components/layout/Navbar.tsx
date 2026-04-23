import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../store/auth.store";
import { getCart } from "../../utils/cart";
import { useEffect, useState } from "react";
import CartDrawer from "../cart/CartDrawer";
import { ChevronDown } from "lucide-react"; // డ్రాప్‌డౌన్ ఐకాన్ కోసం

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [isPickleOpen, setIsPickleOpen] = useState(false); // డ్రాప్‌డౌన్ స్టేట్

  const role = user?.role;

  useEffect(() => {
    const updateCart = () => {
      const cart = getCart();
      setCartCount(cart.length);
    };
    setUser(getUser());
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("cart");
    navigate("/login");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-slate-950 text-white z-50 shadow-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* TOP ANNOUNCEMENT BAR */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] md:text-xs py-1.5 text-center font-extrabold uppercase tracking-widest shadow-inner">
          ✨ Special Bulk Orders for Weddings & Events: Sweets • Hots • Pickles ✨
        </div>

        <div className="px-4 md:px-10 py-4 flex items-center justify-between gap-4">
          
          {/* LEFT: BRAND LOGO */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="cursor-pointer group" onClick={() => navigate("/")}>
              <h1 className="text-2xl md:text-3xl text-orange-500 leading-none" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
                Someswari
              </h1>
              <p className="text-[9px] text-orange-200/60 tracking-[0.4em] font-black uppercase mt-1 group-hover:text-white transition-colors">
                Foods & Pickles
              </p>
            </div>
          </div>

          {/* CENTER: SEARCH BAR (Always Visible for Customers) */}
          {(!role || role === "customer") && (
            <div className="flex-1 hidden lg:block max-w-xl">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search Sweets, Savories, Pickles..."
                  className="w-full bg-slate-900 border border-slate-800 px-6 py-2.5 rounded-full text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-600 italic"
                />
                <button className="absolute right-5 top-3 text-slate-500 group-hover:text-orange-500 transition-colors">🔍</button>
              </div>
            </div>
          )}

          {/* RIGHT: NAVIGATION LINKS */}
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-8 text-[11px] font-extrabold tracking-widest text-slate-300">
              
              {role === "admin" ? (
                <>
                  <button onClick={() => navigate("/admin")} className="hover:text-orange-500 transition-all uppercase">Dashboard</button>
                  <button onClick={() => navigate("/admin/approvals")} className="hover:text-orange-500 transition-all uppercase">Approvals</button>
                  <button onClick={() => navigate("/admin/vendors")} className="hover:text-orange-500 transition-all uppercase">Vendors</button>
                </>
              ) : role === "vendor" ? (
                <>
                  <button onClick={() => navigate("/vendor")} className="hover:text-orange-500 transition-all uppercase">Dashboard</button>
                  <button onClick={() => navigate("/vendor/products")} className="hover:text-orange-500 transition-all uppercase">Inventory</button>
                  <button onClick={() => navigate("/vendor/orders")} className="hover:text-orange-500 transition-all uppercase">Orders</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/public-home")} className="hover:text-orange-500 transition-all uppercase">Sweets</button>
                  <button onClick={() => navigate("/public-home")} className="hover:text-orange-500 transition-all uppercase">Hots</button>
                  
                  {/* PICKLES DROPDOWN */}
                  <div 
                    className="relative py-2 cursor-pointer group"
                    onMouseEnter={() => setIsPickleOpen(true)}
                    onMouseLeave={() => setIsPickleOpen(false)}
                  >
                    <button className="flex items-center gap-1 hover:text-orange-500 transition-all uppercase">
                      Pickles <ChevronDown size={14} className={`transition-transform ${isPickleOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isPickleOpen && (
                      <div className="absolute top-full left-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-3 w-44 animate-in fade-in slide-in-from-top-2">
                        <button onClick={() => navigate("/category/veg-pickle")} className="block w-full text-left px-6 py-2 hover:bg-slate-800 hover:text-orange-500 transition-all uppercase text-[10px]">Veg Pickles</button>
                        <button onClick={() => navigate("/category/non-veg-pickle")} className="block w-full text-left px-6 py-2 hover:bg-slate-800 hover:text-red-500 transition-all uppercase text-[10px]">Non-Veg Pickles</button>
                      </div>
                    )}
                  </div>

                  {user && (
                    <button 
                      onClick={() => navigate("/my-orders")} 
                      className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full hover:bg-orange-500 hover:text-white transition-all uppercase border border-orange-500/20"
                    >
                      My Orders
                    </button>
                  )}
                </>
              )}
            </div>

            {/* ACTION BUTTONS: CART & LOGOUT */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <button onClick={() => navigate("/login")} className="text-xs font-bold uppercase tracking-widest hover:text-orange-500 transition px-2">Login</button>
                  <button onClick={() => setCartOpen(true)} className="bg-orange-600 hover:bg-orange-500 px-5 py-2.5 rounded-full flex items-center gap-3 transition-all shadow-lg transform hover:scale-105">
                    <span className="text-xs font-black uppercase tracking-tighter">My Cart</span>
                    <span className="bg-white text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-black">{cartCount}</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  {role === "customer" && (
                    <div onClick={() => setCartOpen(true)} className="cursor-pointer bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full flex items-center gap-2 transition transform hover:scale-105 shadow-lg">
                      <span className="text-xs font-black uppercase">Cart</span>
                      <span className="bg-white text-green-700 text-[10px] px-1.5 rounded-full font-black">{cartCount}</span>
                    </div>
                  )}

                  <button onClick={handleLogout} className="text-[10px] font-black text-slate-400 border border-slate-800 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all uppercase tracking-widest">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <div className={role === "admin" || role === "vendor" ? "h-[85px]" : "h-[115px]"}></div>
    </>
  );
};

export default Navbar;