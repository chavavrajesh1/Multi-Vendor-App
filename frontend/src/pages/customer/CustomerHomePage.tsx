import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../../api/product.api";
import { addItemToCart } from "../../utils/cart";
import ProductCard from "../../components/product/ProductCard";
import toast from "react-hot-toast";

const CustomerHomePage = () => {
  const [products, setProducts] = useState<any[]>([]); // const [search, setSearch] = useState(""); // ❌ Search ని తీసివేశాం
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    // ⚠️ Note: Interval ని ఇక్కడ అలాగే ఉంచాను, కానీ మీరు కావాలంటే 30000 (30s) కి పెంచుకోండి.
    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const handleAddToCart = (product: any, qty: number) => {
    addItemToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  }; // Filter Logic based ONLY on Category (Search Logic Removed)

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesCategory; // ✅ కేవలం కేటగిరీ మాత్రమే చెక్ చేస్తున్నాం
  });

  const categories = [
    { id: "All", label: "All Items" },
    { id: "veg-pickle", label: "Veg Pickles" },
    { id: "non-veg-pickle", label: "Non-Veg" },
    { id: "sweets", label: "Sweets" },
    { id: "hots", label: "Savories" },
  ];

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
                 {" "}
      {/* ❌ WELCOME SECTION & SEARCH BAR పూర్తిగా తొలగించబడ్డాయి */}     {" "}
      {/* పాత కోడ్‌లో Welcome సెక్షన్ కోసం వాడిన ప్యాడింగ్/మార్జిన్ సర్దుబాటు చేశాను */}
           {" "}
      <div className="max-w-7xl mx-auto p-8 pt-12">
                        {/* CATEGORY TABS - Direct Start */}       {" "}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-10 no-scrollbar">
                   {" "}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                selectedCategory === cat.id
                  ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/20"
                  : "bg-white border-slate-100 text-slate-500 hover:border-orange-200"
              }`}
            >
                            {cat.label}           {" "}
            </button>
          ))}
                 {" "}
        </div>
                {/* PRODUCT HEADER */}       {" "}
        <div className="flex justify-between items-end mb-8">
                   {" "}
          <div>
                       {" "}
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
              Popular Choices
            </h2>
                       {" "}
            <div className="h-1.5 w-12 bg-orange-500 mt-2 rounded-full"></div> 
                   {" "}
          </div>
                   {" "}
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg">
                        {filteredProducts.length} Items found          {" "}
          </span>
                 {" "}
        </div>
                {/* GRID CONTENT */}       {" "}
        {loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
                       {" "}
            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                       {" "}
            <p className="text-slate-400 text-sm font-bold animate-pulse">
              Refilling the jars...
            </p>
                     {" "}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                       {" "}
            <p className="text-slate-400 font-bold mb-4">
              We couldn't find any items in this category.
            </p>
                       {" "}
            <button // ❌ Search Logic Removed, కేవలం కేటగిరీని "All" కి సెట్ చేస్తున్నాం
              onClick={() => setSelectedCategory("All")}
              className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
                            Show all items            {" "}
            </button>
                     {" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                       {" "}
            {filteredProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                addToCart={handleAddToCart}
              />
            ))}
                     {" "}
          </div>
        )}
             {" "}
      </div>
               {" "}
    </div>
  );
};

export default CustomerHomePage;
