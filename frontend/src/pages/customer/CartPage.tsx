import { useEffect, useState } from "react";
import { getCart } from "../../utils/cart";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingCart } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.product._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="text-green-500" size={32} />
        <h1 className="text-3xl font-black italic uppercase">My <span className="text-green-500">Cart</span></h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">కార్ట్ ఖాళీగా ఉంది</p>
          <button onClick={() => navigate("/home")} className="mt-4 text-green-600 font-black uppercase italic">Shopping మొదలుపెట్టండి →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product._id} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-black">{item.quantity}x</div>
                <div>
                  <h3 className="font-black text-slate-800 italic uppercase tracking-tighter">{item.product.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹{item.product.price} / UNIT</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-black text-slate-900 text-lg italic">₹{item.product.price * item.quantity}</span>
                <button onClick={() => removeItem(item.product._id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}

          <div className="mt-10 bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Bill Amount</p>
              <p className="text-5xl font-black italic tracking-tighter text-green-500">₹{getTotal()}</p>
            </div>
            <button 
              onClick={() => navigate("/checkout")}
              className="bg-green-500 hover:bg-green-600 text-slate-900 font-black px-12 py-5 rounded-2xl flex items-center gap-3 uppercase italic transition-all shadow-xl shadow-green-500/20 active:scale-95"
            >
              Checkout కి వెళ్ళండి <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;