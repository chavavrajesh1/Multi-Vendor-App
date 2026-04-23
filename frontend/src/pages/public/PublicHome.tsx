import { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../../api/product.api";
import { addItemToCart } from "../../utils/cart";
import toast from "react-hot-toast";
import Hero from "../../components/home/Hero";
import ProductCard from "../../components/product/ProductCard";

const PublicHome = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 2400,
  });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getAllProducts();
      let data = res.data?.data || [];

      if (filters.category) {
        data = data.filter((p: any) => p.category === filters.category);
      }
      data = data.filter((p: any) => p.price >= filters.minPrice);
      if (filters.maxPrice > 0) {
        data = data.filter((p: any) => p.price <= filters.maxPrice);
      }

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => fetchProducts(), 5000); 
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const handleAddToCart = (product: any) => {
    addItemToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Hero />
      
      {/* BULK ORDER ANNOUNCEMENT */}
      <div className="bg-orange-50 py-4 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-orange-800 font-black text-lg uppercase tracking-tight">Planning a Grand Event? 🎊</h3>
            <p className="text-orange-600 text-sm font-semibold">Get wholesale prices on Bulk Orders for Weddings, Parties & Functions!</p>
          </div>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">
            Get Quote
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow bg-white">
        {/* SIDEBAR FILTERS */}
        <div className="w-full md:w-1/4 p-8 border-r border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-black mb-8 text-slate-900 border-b-4 border-orange-500 pb-2 w-fit">Filters</h2>
          <div className="mb-8">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Product Category</label>
            <select
              className="border-2 border-gray-200 p-3 w-full rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-bold text-slate-700 bg-white"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Items</option>
              <optgroup label="Pickles (Pachadi)">
                <option value="veg-pickle">Veg Pickles</option>
                <option value="non-veg-pickle">Non-Veg Pickles</option>
              </optgroup>
              <optgroup label="Snacks & Sweets">
                <option value="sweets">Traditional Sweets</option>
                <option value="hots">Hots / Savories</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Price Range (₹)</p>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={filters.minPrice}
                className="border-2 border-gray-200 p-2 w-full rounded-lg outline-none font-bold text-sm"
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              />
              <input
                type="number"
                value={filters.maxPrice}
                className="border-2 border-gray-200 p-2 w-full rounded-lg outline-none font-bold text-sm"
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              />
            </div>
            <input 
              type="range" min="0" max="2400" value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="w-full md:w-3/4 p-8">
          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
              <p className="text-orange-600 font-bold animate-pulse">Loading fresh treats...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">No items found in this range.</p>
              <button onClick={() => setFilters({ category: "", minPrice: 0, maxPrice: 2400 })} className="mt-4 text-orange-600 font-black underline">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
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