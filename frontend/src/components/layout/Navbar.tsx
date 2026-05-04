import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { useState } from "react";
import CartDrawer from "../cart/CartDrawer";
import { 
  ChevronDown, 
  Search, 
  ShoppingCart, 
  LogOut, 
  Store, 
  Menu, 
  User, 
  ChevronRight 
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Store నుండి డేటా తీసుకోవడం
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const [cartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role = userInfo?.role;
  const cartCount = cartItems.length;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (role === "vendor") navigate("/vendor/dashboard");
    else if (role === "admin") navigate("/admin");
    else navigate("/");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-slate-950/95 backdrop-blur-md text-white z-50 border-b border-slate-900 shadow-2xl">
        
        {/* TOP ANNOUNCEMENT BAR */}
        <div className="bg-orange-600 text-white text-[10px] py-1.5 text-center font-black uppercase tracking-[0.2em]">
          ✨ Fresh Homemade Delicacies & Super Bazar Essentials ✨
        </div>

        <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-6">
          
          {/* LOGO SECTION */}
          <div className="flex items-center shrink-0">
            <div className="cursor-pointer group flex items-center gap-3" onClick={handleLogoClick}>
              <div className="bg-orange-600 p-2.5 rounded-2xl group-hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all">
                <Store size={22} className="text-white" />
              </div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none hidden sm:block font-serif">
                Kitchen <span className="text-orange-500">Kart</span>
                {role === "admin" && (
                  <span className="ml-2 text-[9px] bg-white text-orange-600 px-2 py-0.5 rounded-full font-sans tracking-normal">
                    ADMIN
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* SEARCH BAR */}
          {(role === "customer" || role === "admin" || !role) && (
            <div className="flex-1 max-w-xl relative group hidden lg:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder={role === "admin" ? "Search orders, vendors or products..." : "Search for Milk, Pickles, or Groceries..."}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 px-12 py-3 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-600 shadow-inner"
              />
            </div>
          )}

          {/* NAVIGATION */}
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-8 text-[11px] font-black tracking-widest text-slate-400">
              
              {/* --- ADMIN SECTION --- */}
              {role === "admin" ? (
                <>
                  <button onClick={() => navigate("/admin")} className="text-slate-200 hover:text-orange-500 uppercase transition-all">Dashboard</button>
                  <button onClick={() => navigate("/admin/approvals")} className="text-slate-200 hover:text-orange-500 uppercase transition-all">Approvals</button>
                  <button onClick={() => navigate("/admin/add-category")} className="text-slate-200 hover:text-orange-500 uppercase transition-all">Categories</button>
                  {/* ALL ORDERS BUTTON FOR ADMIN */}
                  <button onClick={() => navigate("/admin/orders")} className="text-slate-200 hover:text-orange-500 uppercase transition-all underline decoration-orange-500 underline-offset-4">All Orders</button>
                </>
              ) : role === "vendor" ? (
                <>
                  <button onClick={() => navigate("/vendor/dashboard")} className="hover:text-orange-500 uppercase transition-all">Dashboard</button>
                  <button onClick={() => navigate("/vendor/products")} className="hover:text-orange-500 uppercase transition-all">My Products</button>
                </>
              ) : (
                <>
                  {/* --- CUSTOMER SECTION --- */}
                  <div 
                    className="relative py-2 cursor-pointer group"
                    onMouseEnter={() => setIsMenuOpen(true)}
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    <button className="flex items-center gap-2 text-slate-200 hover:text-orange-500 transition-all uppercase">
                      <Menu size={16} /> Explore Store <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isMenuOpen && (
                      <div className="absolute top-full -left-10 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl py-5 w-72 overflow-hidden animate-in fade-in slide-in-from-top-2 border-t-orange-500 border-t-2">
                        <p className="px-6 py-2 text-[9px] text-orange-500 font-black uppercase tracking-[0.2em]">Homemade Specials</p>
                        <div className="space-y-1 mb-4">
                          <Link to="/home?category=veg" className="block"><button className="flex items-center justify-between w-full px-6 py-2 hover:bg-slate-900 hover:text-orange-500 text-[11px] font-bold uppercase transition-all group/item">Veg Pickles <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100" /></button></Link>
                          <button onClick={() => navigate("/category/non-veg-pickle")} className="flex items-center justify-between w-full px-6 py-2 hover:bg-slate-900 hover:text-orange-500 text-[11px] font-bold uppercase transition-all group/item">Non-Veg Pickles <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100" /></button>
                          <button onClick={() => navigate("/category/sweets")} className="flex items-center justify-between w-full px-6 py-2 hover:bg-slate-900 hover:text-orange-500 text-[11px] font-bold uppercase transition-all group/item">Sweets & Snacks <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100" /></button>
                        </div>
                        <div className="bg-slate-900/50 py-3 border-y border-slate-800">
                          <p className="px-6 py-2 text-[9px] text-blue-400 font-black uppercase tracking-[0.2em]">Super Bazar Essentials</p>
                          <button onClick={() => navigate("/category/dairy")} className="flex items-center justify-between w-full px-6 py-2 hover:bg-slate-800 hover:text-blue-400 text-[11px] font-bold uppercase transition-all group/item">Dairy (Milk & Curd) <span className="bg-blue-500/20 text-blue-400 text-[8px] px-1.5 rounded">Fresh</span></button>
                          <button onClick={() => navigate("/category/rice-grains")} className="flex items-center justify-between w-full px-6 py-2 hover:bg-slate-800 hover:text-blue-400 text-[11px] font-bold uppercase transition-all group/item">Rice & Grains <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100" /></button>
                        </div>
                        <button onClick={() => navigate("/all-products")} className="w-[88%] mx-auto mt-4 flex items-center justify-center bg-orange-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20">
                          Browse All Store
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={() => navigate("/bulk-orders")} className="hover:text-orange-500 uppercase transition-all">Bulk Orders</button>
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              {!userInfo ? (
                <button onClick={() => navigate("/login")} className="text-[10px] font-black uppercase tracking-widest bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95">Login</button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate("/profile")} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-orange-500 hover:border-orange-500/50 transition-all group relative">
                    <User size={18} />
                  </button>
                  <button onClick={handleLogout} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-red-500/10 hover:border-red-500 transition-all group">
                    <LogOut size={16} className="text-slate-500 group-hover:text-red-500" />
                  </button>
                </div>
              )}

              {/* CART */}
              {(!role || role === "customer") && (
                <button 
                  onClick={() => setCartOpen(true)} 
                  className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-3 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                >
                  <div className="relative">
                    <ShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-3 -right-3 bg-white text-orange-600 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-600 shadow-sm animate-bounce">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter hidden sm:block">Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="h-[75px] md:h-[85px]"></div>
    </>
  );
};

export default Navbar;