import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "@phosphor-icons/react";

interface ProductCardProps {
  product: any;
  addToCart: (product: any, qty: number) => void;
}

const ProductCard = ({ product, addToCart }: ProductCardProps) => {
  const [qty, setQty] = useState(1);

  const increase = () => {
    if (qty < product.stock) setQty(qty + 1);
  };

  const decrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const getImageUrl = () => {
    if (!product || !product.image) return "/placeholder.png";
    if (product.image.startsWith("http")) return product.image;
    const baseUrl = "http://localhost:5000";
    const cleanPath = product.image.replace(/\\/g, "/");
    const finalUrl = `${baseUrl}/${cleanPath.replace(/^\//, "")}`;
    return finalUrl;
  };

  const isNonVeg = product.category === "non-veg-pickle" || product.isVeg === false;
  const isVeg = ["veg-pickle", "sweets", "hots", "kirana"].includes(product.category) || product.isVeg === true;

  return (
    <div className="group bg-white border border-slate-100 rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col relative overflow-hidden h-full">
      
      {/* 1. DISCOUNT & DIETARY TAGS */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        {product.discount > 0 ? (
          <span className="bg-orange-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-widest animate-pulse">
            {product.discount}% Off
          </span>
        ) : <div />}
        
        {(isVeg || isNonVeg) && (
          <div className={`p-1 border-2 ${!product.isVeg ? 'border-red-600' : 'border-green-600'} rounded-sm bg-white shadow-sm`}>
            <div className={`w-2 h-2 rounded-full ${!product.isVeg ? 'bg-red-600' : 'bg-green-600'}`}></div>
          </div>
        )}
      </div>

      {/* 2. IMAGE CONTAINER */}
      <div className="relative h-56 w-full mb-4 overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-50">
        <img
          src={getImageUrl()}
          alt={product.name}
          onError={(e: any) => { e.target.src = "/placeholder.png"; }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* 3. CONTENT SECTION */}
      <div className="px-2 flex flex-col flex-grow">
        {/* ✅ పేరు పొడవుగా ఉన్నా కార్డు డిజైన్ మారకుండా ఇక్కడ హైట్ ఫిక్స్ చేశాను */}
        <div className="h-[3.5rem] mb-1">
          <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-tight line-clamp-2">
            {product.name}
          </h2>
        </div>
        
        {/* కేటగిరీ సెక్షన్ */}
        <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mb-4 min-h-[1.2rem]">
          {product.category?.name || product.category}
        </p>

        {/* ప్రైస్ మరియు స్టాక్ సెక్షన్ - ఇది ఎప్పుడూ ఒకే లెవల్ లో ఉంటుంది */}
        <div className="mt-auto">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-widest">Price</p>
              <p className="text-2xl font-black text-slate-900">₹{product.price}</p>
            </div>
            <div className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest shadow-sm ${
                product.stock > 0 ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
              }`}>
              {product.stock > 0 ? `In Stock` : "Sold Out"}
            </div>
          </div>
        </div>
      </div>

      {/* 4. CONTROLS SECTION */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <button
            onClick={(e) => { e.stopPropagation(); decrease(); }}
            disabled={product.stock === 0}
            className="w-10 h-10 flex items-center justify-center bg-white text-slate-900 rounded-xl hover:bg-orange-600 hover:text-white disabled:opacity-20 transition-all shadow-sm active:scale-90"
          >
            <Minus size={16} weight="bold" />
          </button>

          <span className="text-base font-black text-slate-900">{qty}</span>

          <button
            onClick={(e) => { e.stopPropagation(); increase(); }}
            disabled={product.stock === 0}
            className="w-10 h-10 flex items-center justify-center bg-white text-slate-900 rounded-xl hover:bg-orange-600 hover:text-white disabled:opacity-20 transition-all shadow-sm active:scale-90"
          >
            <Plus size={16} weight="bold" />
          </button>
        </div>

        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            addToCart(product, qty);
            setQty(1); 
          }}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-3 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-orange-600 shadow-xl active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 group/btn"
        >
          <ShoppingCart size={18} weight="bold" className="group-hover/btn:animate-bounce" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;