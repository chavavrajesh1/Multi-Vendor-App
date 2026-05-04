import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/slices/productSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { addItemToCart } from "../../utils/cart";
import ProductCard from "../../components/product/ProductCard";
import Navbar from "../../components/layout/Navbar";
import toast from "react-hot-toast";

const CustomerHomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  
  // URL నుండి కేటగిరీని తీసుకోవడం (Default: All)
  const categoryFilter = searchParams.get("category") || "All";

  // Redux నుండి డేటా తీసుకోవడం
  const { items, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    // ప్రోడక్ట్స్ లేకపోతేనే API కాల్ చేయడం (Optimization)
    if (items.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, items.length]);

  const handleAddToCart = (product: any, qty: number) => {
    addItemToCart(product, qty);
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '15px', background: '#334155', color: '#fff' },
    });
  };

  // ✅ REDUX డేటాను ఫిల్టర్ చేయడం
  const filteredProducts = items.filter((p: any) => {
    if (categoryFilter === "All") return true;

    // కేటగిరీ ఆబ్జెక్ట్ అయితే పేరుని, లేదంటే డైరెక్ట్ స్ట్రింగ్‌ని చెక్ చేస్తుంది
    const pCategory = typeof p.category === 'object' ? p.category.name : p.category;
    
    return pCategory?.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-12 border-l-4 border-orange-600 pl-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {categoryFilter} <span className="text-orange-500">Store</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Fresh homemade pickles delivered to your door.
            </p>
          </div>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-10 h-10 border-2 border-slate-800 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Updating Menu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-slate-900 border-dashed">
            <p className="text-slate-500 font-bold uppercase text-xs">No items found in "{categoryFilter}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((item: any) => (
              <ProductCard key={item._id} product={item} addToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHomePage;