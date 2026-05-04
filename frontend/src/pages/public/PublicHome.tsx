import { useEffect, useState, useMemo } from "react";
import { getAllProducts } from "../../api/product.api";
import { addItemToCart } from "../../utils/cart";
import toast from "react-hot-toast";
import Hero from "../../components/home/Hero";
import ProductCard from "../../components/product/ProductCard";
import { useLocation } from "react-router-dom"; // ✅ Route check కోసం కచ్చితంగా కావాలి

const PublicHome = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // ✅ పక్కా లాజిక్: URL ఖచ్చితంగా "/" (Home) అయితేనే Hero చూపిస్తుంది.
  // ఒకవేళ URL లో /vendor లేదా /admin అని ఉంటే ఇది false అవుతుంది.
  const isHomePage = location.pathname === "/";

  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 2500,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setAllProducts(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products");
      toast.error("Products లోడ్ చేయడం సాధ్యం కాలేదు.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products locally
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p: any) => {
      const matchCategory = filters.category ? p.category === filters.category : true;
      const matchMinPrice = p.price >= filters.minPrice;
      const matchMaxPrice = filters.maxPrice > 0 ? p.price <= filters.maxPrice : true;
      return matchCategory && matchMinPrice && matchMaxPrice;
    });
  }, [allProducts, filters]);

  const handleAddToCart = (product: any) => {
    addItemToCart(product, 1);
    toast.success(`${product.name} కార్ట్‌కి యాడ్ చేయబడింది!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#334155', color: '#fff' }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* ✅ ఇక్కడ కండిషన్ మార్చాను. ఇప్పుడు వెండర్ డాష్‌బోర్డ్‌లో హీరో సెక్షన్ కనిపించదు */}
      {isHomePage && <Hero />}
      
      {/* BULK ORDER ANNOUNCEMENT */}
      <div className="bg-slate-950 py-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-orange-500 font-black text-xl uppercase tracking-tighter italic">పెద్ద ఈవెంట్ ప్లాన్ చేస్తున్నారా? 🎊</h3>
            <p className="text-slate-400 text-sm font-medium">పెళ్లిళ్లు మరియు పార్టీల కోసం బల్క్ ఆర్డర్లపై హోల్‌సేల్ ధరలు పొందండి!</p>
          </div>
          <button 
            onClick={() => window.open(`https://wa.me/91YOURNUMBER?text=Hi, Someswari Pickles! I want a quote for a bulk order.`, '_blank')}
            className="bg-white text-black px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
          >
            Get Quote
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full py-12 px-6 gap-12">
        
        {/* SIDEBAR FILTERS */}
        <div className="w-full md:w-1/4 space-y-10">
          <div>
            <h2 className="text-2xl font-black mb-6 text-slate-900 italic uppercase tracking-tighter">
              Filters <span className="text-orange-500">.</span>
            </h2>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Category</label>
            <select
              className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <optgroup label="Pickles">
                <option value="veg-pickle">Veg Pickles</option>
                <option value="non-veg-pickle">Non-Veg Pickles</option>
              </optgroup>
              <optgroup label="Sweets & Hots">
                <option value="sweets">Sweets</option>
                <option value="hots">Savories (Hots)</option>
              </optgroup>
              <optgroup label="Kitchen Essentials">
                <option value="kirana">Kirana Items</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-6">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price Range (₹{filters.maxPrice})</label>
            <input 
              type="range" min="0" max="2500" step="50" value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
              <span>₹0</span>
              <span>₹2500+</span>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold italic">ప్రస్తుతానికి ఏమీ దొరకలేదు.</p>
              <button 
                onClick={() => setFilters({ category: "", minPrice: 0, maxPrice: 2500 })} 
                className="mt-4 text-orange-500 font-black text-xs uppercase tracking-widest hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} addToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicHome;